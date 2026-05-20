import { expect } from "chai";
import { ethers } from "hardhat";
import { DocAuth } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DocAuth", function () {
  let docAuth: DocAuth;
  let owner: SignerWithAddress;
  let institution: SignerWithAddress;
  let unauthorizedUser: SignerWithAddress;

  // Sample test data
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("sample-document-content"));
  const sampleMetadata = JSON.stringify({
    name: "John Doe",
    rollNo: "CS2024001",
    dateOfIssue: "2024-06-15",
    docType: "Degree Certificate",
    institution: "Test University",
  });

  beforeEach(async function () {
    [owner, institution, unauthorizedUser] = await ethers.getSigners();

    const DocAuthFactory = await ethers.getContractFactory("DocAuth");
    docAuth = await DocAuthFactory.deploy();
    await docAuth.waitForDeployment();
  });

  // ─── Deployment ──────────────────────────────

  describe("Deployment", function () {
    it("should set the deployer as owner", async function () {
      expect(await docAuth.owner()).to.equal(owner.address);
    });

    it("should authorize the deployer as an issuer", async function () {
      expect(await docAuth.authorizedIssuers(owner.address)).to.be.true;
    });

    it("should start with zero documents", async function () {
      expect(await docAuth.getTotalDocuments()).to.equal(0);
    });
  });

  // ─── Access Control ──────────────────────────

  describe("Access Control", function () {
    it("should allow owner to add an issuer", async function () {
      await expect(docAuth.addIssuer(institution.address))
        .to.emit(docAuth, "IssuerAdded")
        .withArgs(institution.address);

      expect(await docAuth.authorizedIssuers(institution.address)).to.be.true;
    });

    it("should allow owner to remove an issuer", async function () {
      await docAuth.addIssuer(institution.address);
      await expect(docAuth.removeIssuer(institution.address))
        .to.emit(docAuth, "IssuerRemoved")
        .withArgs(institution.address);

      expect(await docAuth.authorizedIssuers(institution.address)).to.be.false;
    });

    it("should reject non-owner adding an issuer", async function () {
      await expect(
        docAuth.connect(unauthorizedUser).addIssuer(institution.address)
      ).to.be.revertedWithCustomError(docAuth, "OwnableUnauthorizedAccount");
    });

    it("should reject adding zero address", async function () {
      await expect(
        docAuth.addIssuer(ethers.ZeroAddress)
      ).to.be.revertedWith("DocAuth: zero address");
    });

    it("should reject adding already-authorized issuer", async function () {
      await docAuth.addIssuer(institution.address);
      await expect(
        docAuth.addIssuer(institution.address)
      ).to.be.revertedWith("DocAuth: already authorized");
    });
  });

  // ─── Issue Document ──────────────────────────

  describe("issueDocument", function () {
    it("should issue a document successfully", async function () {
      await expect(docAuth.issueDocument(sampleHash, sampleMetadata))
        .to.emit(docAuth, "DocumentIssued")
        .withArgs(sampleHash, owner.address, sampleMetadata, await getBlockTimestamp());

      const doc = await docAuth.verifyDocument(sampleHash);
      expect(doc.fileHash).to.equal(sampleHash);
      expect(doc.issuer).to.equal(owner.address);
      expect(doc.revoked).to.be.false;
      expect(doc.exists).to.be.true;

      expect(await docAuth.getTotalDocuments()).to.equal(1);
    });

    it("should store metadata correctly", async function () {
      await docAuth.issueDocument(sampleHash, sampleMetadata);
      const doc = await docAuth.verifyDocument(sampleHash);
      expect(doc.metadata).to.equal(sampleMetadata);
    });

    it("should reject duplicate document hash", async function () {
      await docAuth.issueDocument(sampleHash, sampleMetadata);
      await expect(
        docAuth.issueDocument(sampleHash, sampleMetadata)
      ).to.be.revertedWith("DocAuth: document already exists");
    });

    it("should reject zero hash", async function () {
      await expect(
        docAuth.issueDocument(ethers.ZeroHash, sampleMetadata)
      ).to.be.revertedWith("DocAuth: file hash cannot be zero");
    });

    it("should reject empty metadata", async function () {
      await expect(
        docAuth.issueDocument(sampleHash, "")
      ).to.be.revertedWith("DocAuth: metadata cannot be empty");
    });

    it("should reject unauthorized issuer", async function () {
      await expect(
        docAuth.connect(unauthorizedUser).issueDocument(sampleHash, sampleMetadata)
      ).to.be.revertedWith("DocAuth: caller is not an authorized issuer");
    });

    it("should allow authorized institution to issue", async function () {
      await docAuth.addIssuer(institution.address);
      await docAuth.connect(institution).issueDocument(sampleHash, sampleMetadata);

      const doc = await docAuth.verifyDocument(sampleHash);
      expect(doc.issuer).to.equal(institution.address);
      expect(doc.exists).to.be.true;
    });

    it("should track documents per issuer", async function () {
      await docAuth.addIssuer(institution.address);

      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("doc-1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("doc-2"));

      await docAuth.connect(institution).issueDocument(hash1, sampleMetadata);
      await docAuth.connect(institution).issueDocument(hash2, sampleMetadata);

      const hashes = await docAuth.getIssuerDocumentHashes(institution.address);
      expect(hashes.length).to.equal(2);
      expect(hashes[0]).to.equal(hash1);
      expect(hashes[1]).to.equal(hash2);
    });
  });

  // ─── Verify Document ─────────────────────────

  describe("verifyDocument", function () {
    it("should return empty struct for non-existent hash", async function () {
      const randomHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent"));
      const doc = await docAuth.verifyDocument(randomHash);
      expect(doc.exists).to.be.false;
      expect(doc.issuer).to.equal(ethers.ZeroAddress);
    });

    it("should return correct data for existing document", async function () {
      await docAuth.issueDocument(sampleHash, sampleMetadata);
      const doc = await docAuth.verifyDocument(sampleHash);

      expect(doc.exists).to.be.true;
      expect(doc.fileHash).to.equal(sampleHash);
      expect(doc.metadata).to.equal(sampleMetadata);
      expect(doc.issuer).to.equal(owner.address);
      expect(doc.revoked).to.be.false;
    });
  });

  // ─── Revoke Document ─────────────────────────

  describe("revokeDocument", function () {
    beforeEach(async function () {
      await docAuth.issueDocument(sampleHash, sampleMetadata);
    });

    it("should revoke a document successfully", async function () {
      await expect(docAuth.revokeDocument(sampleHash))
        .to.emit(docAuth, "DocumentRevoked")
        .withArgs(sampleHash, owner.address, await getBlockTimestamp());

      const doc = await docAuth.verifyDocument(sampleHash);
      expect(doc.revoked).to.be.true;
    });

    it("should reject revoking already-revoked document", async function () {
      await docAuth.revokeDocument(sampleHash);
      await expect(
        docAuth.revokeDocument(sampleHash)
      ).to.be.revertedWith("DocAuth: document already revoked");
    });

    it("should reject revocation by non-issuer", async function () {
      await expect(
        docAuth.connect(unauthorizedUser).revokeDocument(sampleHash)
      ).to.be.revertedWith("DocAuth: caller is not the document issuer");
    });

    it("should reject revocation of non-existent document", async function () {
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(
        docAuth.revokeDocument(fakeHash)
      ).to.be.revertedWith("DocAuth: document does not exist");
    });

    it("should only allow original issuer to revoke", async function () {
      await docAuth.addIssuer(institution.address);
      // institution did NOT issue this document — owner did
      await expect(
        docAuth.connect(institution).revokeDocument(sampleHash)
      ).to.be.revertedWith("DocAuth: caller is not the document issuer");
    });
  });

  // ─── Helper ──────────────────────────────────

  async function getBlockTimestamp(): Promise<number> {
    const block = await ethers.provider.getBlock("latest");
    return block!.timestamp;
  }
});
