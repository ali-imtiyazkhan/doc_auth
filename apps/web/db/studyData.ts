export interface KeyTerm {
  term: string;
  definition: string;
}

export interface QuickQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface SubSection {
  id: string;
  title: string;
  concepts: string;
  examTips: string[];
  keyTerms: KeyTerm[];
  quickQuiz: QuickQuizItem[];
}

export interface DomainData {
  id: number;
  title: string;
  color: string;
  sections: SubSection[];
}

export const studyData: DomainData[] = [
  // ==========================================
  // DOMAIN 1: IDENTITY & ACCESS MANAGEMENT
  // ==========================================
  {
    id: 1,
    title: "Identity & Access Management",
    color: "purple",
    sections: [
      {
        id: "1.1",
        title: "Authentication Mechanisms",
        concepts: `Authentication is the process of verifying the identity of a user, system, or client. It answers the question: *Who are you?*

Modern authentication systems rely on combining multiple, independent factors to increase assurance. These factors are divided into:
1. **Something You Know (Knowledge):** Passwords, PINs, security questions. These are the most common but easiest to compromise.
2. **Something You Have (Possession):** Hardware tokens, smart cards, authenticator apps (TOTP), SMS codes (though SMS is discouraged due to SIM-swapping risk).
3. **Something You Are (Inherence):** Biometrics such as fingerprints, facial geometry, retina scans, iris scans. High-security environments must include 'liveness detection' to prevent physical spoofing.
4. **Somewhere You Are (Location):** GPS coordinates, IP address subnets, geofencing.
5. **Something You Do (Behavior):** Typing cadence, mouse movements, signature dynamics.

Multi-Factor Authentication (MFA) requires two or more *different* factors. Using a password and a PIN is NOT MFA, as both belong to the Knowledge factor.`,
        examTips: [
          "MFA requires distinct factors. Using a password and a PIN is only Single-Factor (Knowledge + Knowledge).",
          "Biometrics have two critical error rates: False Acceptance Rate (FAR - Type II, security breach) and False Rejection Rate (FRR - Type I, user frustration). The point where they meet is the Crossover Error Rate (CER). The lower the CER, the more accurate the biometric system."
        ],
        keyTerms: [
          { term: "TOTP", definition: "Time-based One-Time Password. A dynamic, 6-digit code that changes every 30-60 seconds, generated cryptographically." },
          { term: "Crossover Error Rate (CER)", definition: "The point where the False Acceptance Rate (FAR) equals the False Rejection Rate (FRR). Used to measure biometric accuracy." },
          { term: "Liveness Detection", definition: "A security check in biometrics to verify that the biometric sample is from a living human being, preventing spoofing." }
        ],
        quickQuiz: [
          {
            question: "Which of the following is considered Multi-Factor Authentication?",
            options: [
              "A password and a PIN code",
              "A smart card and a fingerprint scan",
              "A hardware token and an SMS code",
              "A security question and a password"
            ],
            answerIndex: 1,
            explanation: "A smart card is 'something you have' and a fingerprint is 'something you are'. This combines two distinct factors."
          },
          {
            question: "Which biometric metric measures the system's overall accuracy?",
            options: [
              "False Acceptance Rate (FAR)",
              "False Rejection Rate (FRR)",
              "Crossover Error Rate (CER)",
              "Liveness Detection Threshold"
            ],
            answerIndex: 2,
            explanation: "CER represents the equal balance between Type I and Type II errors; the lower the CER, the more accurate and reliable the system."
          },
          {
            question: "Why is SMS-based authentication discouraged for high-security environments?",
            options: [
              "It requires specialized hardware devices",
              "It is prone to SIM-swapping attacks and network interception",
              "It has a high False Rejection Rate",
              "It uses asymmetric cryptography which is too slow"
            ],
            answerIndex: 1,
            explanation: "SMS messages are transmitted unencrypted over cellular networks and are highly vulnerable to SIM-swap social engineering."
          }
        ]
      },
      {
        id: "1.2",
        title: "Authorization Frameworks",
        concepts: `Authorization is the process of determining what an authenticated user or system is allowed to do. It answers the question: *What can you access?*

There are four primary authorization and access control models:
1. **Role-Based Access Control (RBAC):** Permissions are assigned to specific roles (e.g., 'Manager', 'Developer'), and users are assigned to those roles. Highly structured but can suffer from 'role explosion' in complex organizations.
2. **Attribute-Based Access Control (ABAC):** An advanced, dynamic model that evaluates attributes belonging to the Subject (user age, role), Object (file classification), and Environment (time of day, device location, IP subnet). Highly flexible and context-aware.
3. **Discretionary Access Control (DAC):** The data owner determines who has access. Commonly used in operating system filesystems. Highly flexible but difficult to manage securely at scale.
4. **Mandatory Access Control (MAC):** The system enforces strict access policies based on security clearances (e.g., Secret, Top Secret) and data classification labels. Commonly used in military and government environments.

For microservices and APIs, **OAuth 2.0** is the industry standard for delegating authorization. It allows users to grant limited tokens (scopes) to third-party clients without exposing passwords.`,
        examTips: [
          "ABAC is the most flexible, context-aware, and fine-grained authorization model.",
          "OAuth 2.0 is strictly an AUTHORIZATION delegation framework, not an authentication protocol (though OpenID Connect is built on top of it to add authentication)."
        ],
        keyTerms: [
          { term: "RBAC", definition: "Role-Based Access Control. Access is granted based on predefined organization roles, making management easier at scale." },
          { term: "ABAC", definition: "Attribute-Based Access Control. Access is evaluated at request-time using subject, resource, and environmental attributes." },
          { term: "OAuth 2.0", definition: "An open authorization protocol allowing applications secure delegated API access using authorization tokens." }
        ],
        quickQuiz: [
          {
            question: "A system administrator wants to allow access to files only during work hours (9 AM - 5 PM) from office computers. Which access control model is best suited?",
            options: [
              "Discretionary Access Control (DAC)",
              "Role-Based Access Control (RBAC)",
              "Attribute-Based Access Control (ABAC)",
              "Mandatory Access Control (MAC)"
            ],
            answerIndex: 2,
            explanation: "ABAC naturally evaluates environmental attributes (time and location) to determine access."
          },
          {
            question: "Which of the following is a primary characteristic of Mandatory Access Control (MAC)?",
            options: [
              "Users can modify file permissions at their own discretion.",
              "Access is granted dynamically based on typing speed.",
              "Access decisions are based on data labels and user security clearances.",
              "It is built entirely on OAuth 2.0 authentication headers."
            ],
            answerIndex: 2,
            explanation: "MAC enforces central, system-wide policies based on clearance levels (e.g., Secret) and data labels."
          },
          {
            question: "What is the primary purpose of the OAuth 2.0 protocol?",
            options: [
              "To perform secure federated database queries.",
              "To delegate limited API access authorization to third-party apps without sharing credentials.",
              "To verify biometric identities using liveness detection.",
              "To replace SSL/TLS transport layer encryption."
            ],
            answerIndex: 1,
            explanation: "OAuth 2.0 is designed specifically to allow secure, token-based authorization delegation for web services."
          }
        ]
      },
      {
        id: "1.3",
        title: "User Lifecycle Management",
        concepts: `User Lifecycle Management covers the entire lifespan of an identity within an organization: from the initial hire and onboarding, through role adjustments and promotions, to final offboarding and termination.

Key phases include:
1. **Provisioning:** Creating the user account in directory systems (e.g., Active Directory) and assigning initial group memberships based on the 'Principle of Least Privilege'.
2. **Maintenance:** Managing role changes. As employees change jobs, new permissions are added, but *old permissions must be removed*. Failure to do this leads to **Privilege Creep** (or Privilege Bloat).
3. **Access Certification (Attestation):** Periodic reviews where managers must formally sign off and justify all access rights held by their staff.
4. **Deprovisioning (Offboarding):** Disabling accounts immediately upon termination. Delay in deprovisioning is a major risk, as terminated employees can access internal files or steal code. Automated deprovisioning linked directly to HR systems is the gold standard.`,
        examTips: [
          "Privilege Creep is a major security risk that occurs when employees change roles within a company but retain their old privileges.",
          "Deprovisioning must be immediate. Automation connecting HR databases (e.g., Workday) to Active Directory is critical."
        ],
        keyTerms: [
          { term: "Privilege Creep", definition: "The gradual accumulation of access rights by users beyond what is required for their active job duties." },
          { term: "Attestation", definition: "The formal process where managers review, verify, and certify that users under their command require their current active permissions." },
          { term: "Provisioning", definition: "The process of preparing, creating, and configuring identity accounts and allocating permissions in IT directories." }
        ],
        quickQuiz: [
          {
            question: "What is 'Privilege Creep'?",
            options: [
              "Attackers slowly escalating permissions using operating system exploits.",
              "The gradual accumulation of excess access rights as an employee changes roles over time.",
              "A system slow-down caused by too many concurrent database connections.",
              "The automated creation of temporary admin credentials."
            ],
            answerIndex: 1,
            explanation: "Privilege creep occurs when a user keeps old, unused permissions when moving to new roles, violating least privilege."
          },
          {
            question: "Which control is most effective to discover and clean up privilege creep?",
            options: [
              "Enforcing a strong password length policy",
              "Automating provisioning through HR databases",
              "Conducting regular access certification (attestation) reviews",
              "Implementing SSO for all applications"
            ],
            answerIndex: 2,
            explanation: "Periodic access certifications force managers to review and justify all permissions, letting them prune old, unused rights."
          },
          {
            question: "What is the primary risk associated with manual deprovisioning?",
            options: [
              "It increases the false acceptance rate in biometrics.",
              "It leaves a window of vulnerability where ex-employees can access corporate systems.",
              "It blocks current employees from resetting their passwords.",
              "It violates OAuth 2.0 token expiration rules."
            ],
            answerIndex: 1,
            explanation: "If deprovisioning is manual, delays can occur, allowing terminated employees to access files, download source code, or disrupt databases."
          }
        ]
      },
      {
        id: "1.4",
        title: "Single Sign-On (SSO)",
        concepts: `Single Sign-On (SSO) allows a user to authenticate once and access multiple, independent applications without being prompted for credentials again. It centralizes credential management, increases user satisfaction, and makes logging and auditing simpler.

Core Federated SSO Standards:
1. **SAML 2.0 (Security Assertion Markup Language):** An XML-based open standard. Highly popular in enterprise SaaS environments. It works by exchanging security assertions between an **Identity Provider (IdP)** (e.g., Okta, Entra ID) and a **Service Provider (SP)** (the application, e.g., Salesforce).
2. **OIDC (OpenID Connect):** A modern, lightweight identity layer built on top of the **OAuth 2.0** framework. It uses **JSON Web Tokens (JWT)** and REST APIs. Highly popular for mobile and modern single-page applications.

In a federated SSO environment:
- The **Identity Provider (IdP)** authenticates the user and signs a cryptographic token asserting who the user is.
- The **Service Provider (SP)** trusts the IdP, validates the cryptographic signature, and grants the user access.`,
        examTips: [
          "SAML is XML-based; OpenID Connect (OIDC) is JSON/JWT-based.",
          "SSO represents a single point of failure. If the IdP is compromised, an attacker can access all connected applications, making MFA at the IdP level critical."
        ],
        keyTerms: [
          { term: "Identity Provider (IdP)", definition: "The central system that maintains user credentials and authenticates their identity for federated services." },
          { term: "Service Provider (SP)", definition: "The application or resource that relies on the Identity Provider to authenticate and authorize users." },
          { term: "JWT", definition: "JSON Web Token. A compact, URL-safe container used in OIDC to transmit claims securely as a signed JSON object." }
        ],
        quickQuiz: [
          {
            question: "SAML 2.0 is based on which data format?",
            options: [
              "JSON",
              "YAML",
              "XML",
              "Protobuf"
            ],
            answerIndex: 2,
            explanation: "SAML 2.0 uses XML-based assertions to transmit authentication and authorization statements."
          },
          {
            question: "Which protocol adds an identity/authentication layer directly on top of OAuth 2.0?",
            options: [
              "SAML 2.0",
              "OpenID Connect (OIDC)",
              "LDAP",
              "Kerberos"
            ],
            answerIndex: 1,
            explanation: "OIDC is a simple identity layer built on OAuth 2.0, providing user claims inside a JSON Web Token (JWT)."
          },
          {
            question: "What is a major security risk or single point of failure in SSO setups?",
            options: [
              "Users forget their passwords more frequently.",
              "If the Identity Provider (IdP) is compromised, all connected service providers are exposed.",
              "It increases cellular network SMS charges.",
              "It forces all services to run on a local intranet."
            ],
            answerIndex: 1,
            explanation: "Centralizing authentication means the IdP holds the keys to the castle. Protecting the IdP with MFA and strict monitoring is critical."
          }
        ]
      }
    ]
  },
  // ==========================================
  // DOMAIN 2: NETWORK & INFRASTRUCTURE SECURITY
  // ==========================================
  {
    id: 2,
    title: "Network & Infrastructure Security",
    color: "green",
    sections: [
      {
        id: "2.1",
        title: "Network Architecture & Segmentation",
        concepts: `Network architecture defines how devices are connected and isolated to protect critical corporate assets.

Key concepts include:
1. **Demilitarized Zone (DMZ):** A physical or logical subnetwork that contains and exposes an organization's external-facing services (e.g., web servers, public DNS) to the untrusted public internet. It acts as a buffer zone. Internal database servers must *never* sit in the DMZ.
2. **Subnetting & VLANs:** Virtual Local Area Networks (VLANs) segment a physical switch into isolated logical networks, controlling broadcast domains and limiting traffic.
3. **Microsegmentation:** A security technique that isolates individual workloads or virtual machines within a data center. Unlike perimeter firewalls, microsegmentation manages **East-West** (internal lateral) traffic, preventing lateral attack movement.`,
        examTips: [
          "North-South traffic goes between the internal network and the public internet. East-West traffic goes laterally between internal systems.",
          "Databases should always be in a private subnet, behind the DMZ web servers, reachable only via strict internal firewall rules."
        ],
        keyTerms: [
          { term: "DMZ", definition: "Demilitarized Zone. A buffer network segment separating the untrusted public internet from the high-security private intranet." },
          { term: "Microsegmentation", definition: "Granular network isolation applied to individual application workloads to prevent lateral internal movement." },
          { term: "VLAN", definition: "Virtual Local Area Network. A logical network division created at Layer 2 of the OSI model to isolate broadcast domains." }
        ],
        quickQuiz: [
          {
            question: "Where should an organization's master customer database server be located?",
            options: [
              "In the DMZ alongside the public web server",
              "In a public subnet for easy cloud administration",
              "In a private internal subnet, accessible only by the DMZ web server",
              "On a virtual bridged adapter open to the WAN gateway"
            ],
            answerIndex: 2,
            explanation: "Placing the database in a private subnet and only allowing web server connections minimizes public exposure and attack vectors."
          },
          {
            question: "What type of traffic is microsegmentation primarily designed to control?",
            options: [
              "North-South traffic (ingress/egress to the internet)",
              "East-West traffic (lateral movement inside the data center)",
              "SaaS cloud web routing",
              "VPN remote worker authentication packets"
            ],
            answerIndex: 1,
            explanation: "Microsegmentation focuses on isolating individual workloads to control lateral (East-West) movement inside the network boundary."
          },
          {
            question: "What is a primary benefit of creating a DMZ?",
            options: [
              "It automatically encrypts all database transactions.",
              "It provides a buffer segment containing public-facing servers, protecting the internal network.",
              "It increases the speed of public-facing web servers.",
              "It replaces the need for network intrusion detection software."
            ],
            answerIndex: 1,
            explanation: "A DMZ isolates public servers from the internal intranet, ensuring that web compromises don't grant immediate internal network access."
          }
        ]
      },
      {
        id: "2.2",
        title: "Threat Detection & Prevention",
        concepts: `Threat detection and prevention involve active systems that monitor networks, logs, and systems for malicious activity and take immediate action.

Key tools include:
1. **Intrusion Detection System (IDS):** A passive, out-of-band monitoring device that inspects traffic copies (via TAPs or SPAN ports). If it matches a known threat signature or statistical anomaly, it generates an alert. *It cannot block traffic.*
2. **Intrusion Prevention System (IPS):** An active, in-line device. All traffic flows *through* the IPS. If a threat is identified, it can immediately drop packets, reset connections, or block the offending IP address in real-time.
3. **Security Information and Event Management (SIEM):** A central software platform that ingests logs from active directories, firewalls, endpoints (EDR), and servers. It performs real-time **correlation**, matching disparate events to detect coordinated attacks and alert the SOC team.`,
        examTips: [
          "An IDS is out-of-band and passive (alerts only); an IPS is in-line and active (can drop packets/block ports).",
          "SIEM platforms are the central brain for log ingestion, aggregation, correlation, and alerting in a modern security operations center."
        ],
        keyTerms: [
          { term: "IPS", definition: "Intrusion Prevention System. An active, in-line security device capable of detecting and blocking network threats in real-time." },
          { term: "SIEM", definition: "Security Information and Event Management. A central platform that aggregates and correlates security logs from across the enterprise." },
          { term: "Correlation Engine", definition: "A SIEM component that analyzes multiple, unrelated log events to identify patterns of coordinated security incidents." }
        ],
        quickQuiz: [
          {
            question: "What is the key functional difference between an IDS and an IPS?",
            options: [
              "An IDS can block ports, while an IPS only aggregates security logs.",
              "An IDS operates passively out-of-band to alert, while an IPS operates in-line to actively block threats.",
              "An IDS is hardware-based, whereas an IPS is entirely cloud-native.",
              "An IDS only runs on databases, while an IPS operates at the application layer."
            ],
            answerIndex: 1,
            explanation: "An IDS detects and alerts passively; an IPS sits directly in-line with traffic, letting it physically block threat packets."
          },
          {
            question: "Which of the following functions does a SIEM platform perform?",
            options: [
              "It encrypts internal backup drives using AES-256.",
              "It aggregates, normalizes, and correlates logs from disparate enterprise systems.",
              "It establishes site-to-site IPsec VPN tunnels.",
              "It intercepts and blocks corporate rogue access points."
            ],
            answerIndex: 1,
            explanation: "A SIEM centralizes log management, normalizing and correlating firewall, server, and active directory logs for threat analysis."
          },
          {
            question: "An engineer wants to correlate active directory logins with firewall egress alerts. Which tool is designed for this?",
            options: [
              "An IPS",
              "A stateful router",
              "A SIEM",
              "A passive TAP"
            ],
            answerIndex: 2,
            explanation: "A SIEM's correlation engine is built specifically to analyze logs from different systems to connect patterns of an ongoing attack."
          }
        ]
      },
      {
        id: "2.3",
        title: "Encryption in Transit",
        concepts: `Encryption in transit protects data as it travels across untrusted networks, preventing eavesdropping and tampering.

Key mechanisms:
1. **SSL/TLS:** The foundation of secure web traffic (HTTPS). TLS 1.3 is the modern, secure version, which reduces handshake overhead and deprecates weak ciphers.
2. **IPsec (Internet Protocol Security):** A framework of open standards that encrypts and authenticates traffic at the **Network Layer** (Layer 3). Commonly used to create virtual private networks (VPNs).
   - **Transport Mode:** Encrypts only the packet payload; the original IP header is left unencrypted. Used for end-to-end host communication.
   - **Tunnel Mode:** Encrypts *both* the payload and the original IP header, placing them inside a new IP packet. Used for site-to-site gateway VPNs.
3. **Perfect Forward Secrecy (PFS):** A cryptographic property ensuring that a compromise of long-term private keys (e.g., the server's SSL key) does not expose past session keys. Ephemeral Diffie-Hellman (**ECDHE**) provides this.`,
        examTips: [
          "IPsec Tunnel Mode encrypts the entire original IP packet (payload + original header); Transport Mode only encrypts the payload.",
          "Perfect Forward Secrecy (PFS) is achieved using ephemeral key exchanges (ECDHE), generating unique, temporary session keys."
        ],
        keyTerms: [
          { term: "IPsec Tunnel Mode", definition: "An IPsec configuration that encrypts the entire original packet, including headers, commonly used for site-to-site VPNs." },
          { term: "Perfect Forward Secrecy (PFS)", definition: "A cryptographic standard that ensures session keys are not compromised if long-term private keys are stolen." },
          { term: "ECDHE", definition: "Elliptic Curve Diffie-Hellman Ephemeral. A key exchange protocol that provides Perfect Forward Secrecy." }
        ],
        quickQuiz: [
          {
            question: "Which IPsec mode encrypts both the original IP header and the packet payload?",
            options: [
              "Transport Mode",
              "Tunnel Mode",
              "Symmetric Mode",
              "Ephemeral Mode"
            ],
            answerIndex: 1,
            explanation: "Tunnel Mode encapsulates the entire original packet inside a new packet with a new header, providing complete endpoint-to-endpoint concealment."
          },
          {
            question: "What is the primary advantage of Ephemeral Diffie-Hellman (ECDHE) key exchange in TLS?",
            options: [
              "It speeds up database index retrieval.",
              "It guarantees Perfect Forward Secrecy (PFS) by generating unique session keys.",
              "It avoids using digital certificates entirely.",
              "It operates at OSI Layer 2 to replace VLAN security."
            ],
            answerIndex: 1,
            explanation: "ECDHE generates unique, dynamic session keys that are deleted immediately after the session, ensuring PFS."
          },
          {
            question: "An organization wants to encrypt all traffic between two offices across the internet without setting up software on individual workstations. What should they deploy?",
            options: [
              "SSL Client VPN",
              "SSH dynamic forwarding tunnel",
              "A Site-to-Site IPsec VPN in Tunnel Mode",
              "An HTTPS reverse proxy"
            ],
            answerIndex: 2,
            explanation: "A site-to-site IPsec VPN links branch routers together, encrypting all inter-office network traffic automatically at the gateway level."
          }
        ]
      },
      {
        id: "2.4",
        title: "Wireless Security",
        concepts: `Wireless security secures communication over radio waves, preventing unauthorized access to corporate networks.

Evolution of Wireless Security:
1. **WEP (Wired Equivalent Privacy):** Severely broken, uses weak RC4 keys and static keys. Never use.
2. **WPA/WPA2:** Introduced TKIP and CCMP (AES). Prone to offline brute-force attacks via key-reinstallation exploits (KRACK).
3. **WPA3:** The modern standard. Replaces Pre-Shared Keys with **Simultaneous Authentication of Equals (SAE)** (Personal mode), rendering offline dictionary attacks impossible.

Corporate wireless deployments:
- **WPA3-Enterprise:** Utilizes **802.1X** network authentication, delegating authentication to a backend **RADIUS** server. Every user logs in with their own individual credentials, ensuring auditing and immediate account revocation.
- **Rogue Access Points:** Unauthorized APs plugged into the corporate network. Attackers can set up an 'Evil Twin' (broadcasting the same corporate SSID) to steal credentials. WIPS is used to mitigate this risk.`,
        examTips: [
          "WPA3-Enterprise uses 802.1X and a RADIUS server for individual user credentials, not a shared pre-shared key.",
          "An Evil Twin is a rogue AP broadcasting the corporate SSID to intercept client logins. WIPS mitigates this by broadcasting deauthentication frames."
        ],
        keyTerms: [
          { term: "802.1X", definition: "An IEEE standard for port-based Network Access Control (PNAC), widely used for securing corporate Wi-Fi and ethernet ports." },
          { term: "RADIUS", definition: "Remote Authentication Dial-In User Service. A central AAA protocol used to authenticate wireless users against corporate directories." },
          { term: "WIPS", definition: "Wireless Intrusion Prevention System. A security system that monitors radio spectrums to detect and block unauthorized rogue APs." }
        ],
        quickQuiz: [
          {
            question: "Which standard provides port-based access control and forms the foundation of WPA3-Enterprise Wi-Fi?",
            options: [
              "802.3u",
              "802.1X",
              "802.11ac",
              "802.15.1"
            ],
            answerIndex: 1,
            explanation: "802.1X is the port-based authentication framework used to negotiate secure logins against RADIUS servers before access is granted."
          },
          {
            question: "How does a Wireless Intrusion Prevention System (WIPS) actively block a client from connecting to a corporate Evil Twin AP?",
            options: [
              "By physically shutting down the client's laptop power.",
              "By broadcasting wireless deauthentication frames to disconnect the client from the rogue AP.",
              "By encrypting the client's local hard disk.",
              "By re-keying the corporate internet gateway router."
            ],
            answerIndex: 1,
            explanation: "WIPS sends wireless deauthentication packets to targeted clients, severing their connection to the rogue AP."
          },
          {
            question: "What is the primary security improvement of WPA3-Personal (SAE) over WPA2-Personal (PSK)?",
            options: [
              "It replaces AES encryption with MD5 hashing.",
              "It makes offline dictionary/brute-force attacks against the password mathematically impossible.",
              "It completely removes the need for physical routers.",
              "It forces all wireless traffic to bypass local firewalls."
            ],
            answerIndex: 1,
            explanation: "SAE uses a secure handshake that prevents offline dictionary brute-forcing of captured handshakes, a major weakness in WPA2."
          }
        ]
      }
    ]
  },
  // ==========================================
  // DOMAIN 3: GOVERNANCE, RISK & COMPLIANCE
  // ==========================================
  {
    id: 3,
    title: "Governance, Risk & Compliance",
    color: "orange",
    sections: [
      {
        id: "3.1",
        title: "Regulatory Compliance",
        concepts: `Regulatory compliance ensures that organizations adhere to laws, industry standards, and government policies governing data security and privacy.

Key Regulations & Standards:
1. **GDPR (General Data Protection Regulation):** EU regulation protecting personal data of EU citizens. Enforces the 'Right to Be Forgotten'.
2. **HIPAA:** US federal law regulating Protected Health Information (PHI).
3. **PCI-DSS:** An industry-enforced standard governing cardholder data protection.
4. **SOC 2:** Auditing framework focusing on Security, Availability, Processing Integrity, Confidentiality, and Privacy.
   - **Type I Report:** Evaluates the *design* of security controls at a single point in time.
   - **Type II Report:** Evaluates the *operating effectiveness* of controls over a testing period (usually 6-12 months).`,
        examTips: [
          "SOC 2 Type II reports evaluate control effectiveness over a period of time, whereas Type I reports only evaluate design at a specific point in time.",
          "PCI-DSS is an industry standard (credit cards), not a government-legislated law."
        ],
        keyTerms: [
          { term: "GDPR", definition: "A strict European Union privacy law establishing citizens' data controls and severe fines for data breaches." },
          { term: "SOC 2 Type II", definition: "An independent audit report evaluating security control operations over a duration of time." },
          { term: "PHI", definition: "Protected Health Information. Individually identifiable health records protected under the US HIPAA law." }
        ],
        quickQuiz: [
          {
            question: "What is the key difference between a SOC 2 Type I and a SOC 2 Type II report?",
            options: [
              "Type I is for small businesses, Type II is for enterprises.",
              "Type I evaluates control design at a specific point in time; Type II evaluates operational effectiveness over a period of time.",
              "Type I focuses on financial reporting; Type II focuses on physical building security.",
              "Type I is written by developers; Type II is written by external CPA auditors."
            ],
            answerIndex: 1,
            explanation: "Type II evaluates how well controls actually worked over a period of time (e.g., 6 months), which is much more thorough than a point-in-time design review (Type I)."
          },
          {
            question: "Which of the following describes PCI-DSS?",
            options: [
              "A US federal law regulating medical records privacy.",
              "An EU regulation enforcing the right to be forgotten.",
              "An industry standard governing cardholder data protection, enforced by payment networks.",
              "A government-sponsored hardware firewall certificate."
            ],
            answerIndex: 2,
            explanation: "PCI-DSS is an industry framework created by major credit card companies, not a federal or regional government law."
          },
          {
            question: "What is a core right granted to EU citizens under the GDPR framework?",
            options: [
              "The right to free enterprise broadband.",
              "The right to be forgotten (data erasure).",
              "The right to inspect military satellite feeds.",
              "The right to bypass corporate software licensing."
            ],
            answerIndex: 1,
            explanation: "Under GDPR, individuals have the 'right to erasure' (to be forgotten), requiring companies to delete their personal data upon request."
          }
        ]
      },
      {
        id: "3.2",
        title: "Risk Assessment",
        concepts: `Risk Assessment is the core of security management. It identifies threats, evaluates asset values, and calculates potential impacts.

Quantitative Risk Analysis Formulas:
- **Single Loss Expectancy (SLE):** Value × Exposure Factor.
  $$\\text{SLE} = \\text{AV} \\times \\text{EF}$$
- **Annualized Loss Expectancy (ALE):** SLE × ARO.
  $$\\text{ALE} = \\text{SLE} \\times \\text{ARO}$$

Risk Management Strategies:
1. **Mitigation:** Deploying controls to lower risk (e.g., firewalls).
2. **Transference:** Shifting the financial burden (e.g., buying cybersecurity insurance).
3. **Acceptance:** Deciding to bear the loss because control costs are too high.
4. **Avoidance:** Eliminating the risk completely by stopping the activity.`,
        examTips: [
          "ALE = SLE × ARO. Remember that ARO is an annual frequency. A threat occurring once every five years has an ARO of 0.2.",
          "Selecting a strategy is based on Cost-Benefit Analysis. If a control costs $50,000/yr but only saves $5,000/yr of risk, the logical choice is Risk Acceptance."
        ],
        keyTerms: [
          { term: "Single Loss Expectancy (SLE)", definition: "The estimated financial loss of a single asset compromise event (Asset Value × Exposure Factor)." },
          { term: "Annualized Loss Expectancy (ALE)", definition: "The projected monetary loss an organization expects to experience from a threat per year (SLE × ARO)." },
          { term: "Risk Transference", definition: "A risk response strategy that shifts the impact and ownership of a risk to a third party, such as an insurance firm." }
        ],
        quickQuiz: [
          {
            question: "A company's server facility is valued at $1,000,000. An earthquake is projected to destroy 40% of the facility. An earthquake occurs once every 50 years. What is the Annualized Loss Expectancy (ALE)?",
            options: [
              "SLE = $400,000; ALE = $8,000",
              "SLE = $400,000; ALE = $400,000",
              "SLE = $1,000,000; ALE = $20,000",
              "SLE = $200,000; ALE = $4,000"
            ],
            answerIndex: 0,
            explanation: "SLE = $1,000,000 × 0.40 = $400,000. ARO = 1/50 = 0.02. ALE = $400,000 × 0.02 = $8,000."
          },
          {
            question: "Which risk strategy involves purchasing cybersecurity insurance?",
            options: [
              "Risk Avoidance",
              "Risk Mitigation",
              "Risk Transference",
              "Risk Acceptance"
            ],
            answerIndex: 2,
            explanation: "Cyber insurance transfers the financial burden of a breach to the insurance provider, representing Risk Transference."
          },
          {
            question: "If the cost of mitigating a risk is $20,000 annually, but the ALE is only $2,000, what is the most appropriate risk strategy?",
            options: [
              "Risk Mitigation",
              "Risk Avoidance",
              "Risk Acceptance",
              "Risk Transference"
            ],
            answerIndex: 2,
            explanation: "It is not financially logical to spend $20k to save $2k. Accepting the risk is the standard business decision."
          }
        ]
      },
      {
        id: "3.3",
        title: "Security Policies",
        concepts: `Security policies establish the boundaries of acceptable behavior, operational standards, and compliance baselines.

Core Policy Types:
1. **Acceptable Use Policy (AUP):** Defines what activities employees are permitted to perform using corporate-owned IT assets.
2. **Password Policies:** Enforces length, complexity, and age limits.
3. **Change Management:** Ensures updates are authorized, tested, and include a rollback plan.

From policies, organizations develop **Standards** (mandatory baselines), **Guidelines** (recommended actions), and **Procedures** (step-by-step instructions).`,
        examTips: [
          "An AUP (Acceptable Use Policy) defines the rules for what employees can do on company networks and computers.",
          "Change Management must always include a 'rollback plan' to restore systems if the implementation fails."
        ],
        keyTerms: [
          { term: "Acceptable Use Policy (AUP)", definition: "A formal agreement defining user responsibilities and forbidden activities when using company IT resources." },
          { term: "Standards", definition: "Mandatory security baselines or technologies that the organization must adopt (e.g., all laptops must run BitLocker)." },
          { term: "Change Management", definition: "A structured process to ensure that IT changes are approved, tested, documented, and contain rollback strategies." }
        ],
        quickQuiz: [
          {
            question: "Which document defines the rules for employee computer and internet usage at work?",
            options: [
              "Service Level Agreement (SLA)",
              "Acceptable Use Policy (AUP)",
              "Non-Disclosure Agreement (NDA)",
              "Standard Operating Procedure (SOP)"
            ],
            answerIndex: 1,
            explanation: "The AUP is the direct agreement signed by employees defining acceptable and prohibited computer and web activities."
          },
          {
            question: "What is a mandatory requirement for any change management ticket before it is approved for production deployment?",
            options: [
              "It must bypass local firewalls.",
              "It must include a documented rollback plan to restore services in case of failure.",
              "It must use symmetric encryption.",
              "It must be reviewed by the marketing team."
            ],
            answerIndex: 1,
            explanation: "A rollback plan is critical to ensure that if a change breaks production, systems can be immediately restored to a working state."
          },
          {
            question: "How do 'Standards' differ from 'Guidelines' in security policy hierarchies?",
            options: [
              "Standards are mandatory baselines; Guidelines are optional recommendations.",
              "Standards are optional; Guidelines are legally binding.",
              "Standards are written by governments; Guidelines are written by individual developers.",
              "There is no difference; they are interchangeable."
            ],
            answerIndex: 0,
            explanation: "Standards define mandatory settings or systems, while Guidelines offer flexible, recommended best practices."
          }
        ]
      },
      {
        id: "3.4",
        title: "Business Continuity",
        concepts: `Business Continuity Planning (BCP) and Disaster Recovery Planning (DRP) ensure that an organization can survive major disruptions or natural disasters.

Key metrics defined during the Business Impact Analysis (BIA):
1. **Recovery Time Objective (RTO):** The maximum targeted duration of system downtime. (How fast must we recover?).
2. **Recovery Point Objective (RPO):** The maximum acceptable data age lost from backup systems. (How much data can we lose? E.g., RPO of 1 hour requires hourly backups).
3. **Maximum Tolerable Downtime (MTD):** The absolute maximum time the business can survive without the critical function.

DRP Testing Tiers:
- **Checklist Test:** Stakeholders review recovery plans.
- **Tabletop Exercise:** Verbal run-through of disaster scenarios.
- **Parallel Test:** Spinning up DR servers without production cutover.
- **Full Interruption Test:** Complete cutover to recovery site (high risk).`,
        examTips: [
          "RTO measures restoration speed (time); RPO measures acceptable data loss (data age).",
          "Tabletop exercises provide a high-value, collaborative coordination test with zero risk of production downtime."
        ],
        keyTerms: [
          { term: "RTO", definition: "Recovery Time Objective. The maximum acceptable duration of system downtime before recovery must be complete." },
          { term: "RPO", definition: "Recovery Point Objective. The maximum acceptable age of data lost due to a system failure (defines backup frequency)." },
          { term: "Tabletop Exercise", definition: "A DRP test where team members meet in a conference room to walk through disaster response scenarios verbally." }
        ],
        quickQuiz: [
          {
            question: "A company cannot afford to lose more than 4 hours of transactions in the event of a database failure. Which metric does this direct?",
            options: [
              "Recovery Time Objective (RTO)",
              "Recovery Point Objective (RPO)",
              "Maximum Tolerable Downtime (MTD)",
              "Crossover Error Rate (CER)"
            ],
            answerIndex: 1,
            explanation: "The RPO dictates the maximum age of data lost. A 4-hour limit means backups must run at least every 4 hours."
          },
          {
            question: "What is a primary advantage of a DRP Tabletop Exercise?",
            options: [
              "It shuts down active database servers to test automatic failover.",
              "It validates team coordination and response procedures without any risk of business disruption.",
              "It automatically backs up all offsite files.",
              "It fulfills PCI-DSS wireless penetration test rules."
            ],
            answerIndex: 1,
            explanation: "Tabletops gather stakeholders to discuss plans verbally, highlighting gaps in coordination without impacting production systems."
          },
          {
            question: "What is the relationship between RTO and Maximum Tolerable Downtime (MTD)?",
            options: [
              "RTO must always be longer than MTD.",
              "RTO must always be shorter than MTD.",
              "RTO and MTD must be identical.",
              "There is no relationship; they are unrelated metrics."
            ],
            answerIndex: 1,
            explanation: "RTO is the target recovery time. MTD is the absolute survival threshold. Therefore, target recovery (RTO) must always happen before the survival threshold (MTD) is exceeded."
          }
        ]
      }
    ]
  },
  // ==========================================
  // DOMAIN 4: SECURITY OPERATIONS
  // ==========================================
  {
    id: 4,
    title: "Security Operations",
    color: "blue",
    sections: [
      {
        id: "4.1",
        title: "Incident Response",
        concepts: `Incident Response is the structured process of detecting, managing, and mitigating security breaches.

The NIST Incident Response Lifecycle phases:
1. **Preparation:** CSIRT creation, playbook drafts, forensic tools allocation.
2. **Detection & Analysis:** Identifying and scoping active anomalies and attacks.
3. **Containment, Eradication & Recovery:**
   - **Containment:** Stopping the spread (network or physical isolation).
   - **Eradication:** Removing the threat (deleting malware, disabling accounts).
   - **Recovery:** Restoring services to clean operation.
4. **Post-Incident Activity (Lessons Learned):** Debriefing to analyze breaches and update playbooks.`,
        examTips: [
          "Containment is the first priority once a breach is detected, before eradication starts.",
          "Lessons Learned is the most frequently skipped phase but is the most valuable for long-term improvement."
        ],
        keyTerms: [
          { term: "CSIRT", definition: "Computer Security Incident Response Team. A dedicated group of security professionals responsible for executing the incident plan." },
          { term: "Containment", definition: "Actions taken to isolate a threat, stop its spread, and limit damage to neighboring network systems." },
          { term: "Lessons Learned", definition: "A post-incident review to analyze team actions, document timelines, and strengthen future defenses." }
        ],
        quickQuiz: [
          {
            question: "A security analyst notices active ransomware encrypting directories on a workstation. What is the most immediate first priority?",
            options: [
              "Conduct a lessons learned meeting with executives.",
              "Contain the threat by isolating the workstation from the network.",
              "Format the hard drive to eradicate the malware.",
              "Verify the backup completion timestamp."
            ],
            answerIndex: 1,
            explanation: "Isolating the host (Containment) blocks the ransomware from reaching other network shares, which must happen before eradication can begin."
          },
          {
            question: "Under which phase of the Incident Response lifecycle does disabling compromised user accounts and formatting infected servers fall?",
            options: [
              "Preparation",
              "Detection & Analysis",
              "Eradication",
              "Lessons Learned"
            ],
            answerIndex: 2,
            explanation: "Eradication focus on active removal of the threat from the environment, including deleting malware and closing hacked accounts."
          },
          {
            question: "Why is the 'Lessons Learned' phase considered critical in incident response?",
            options: [
              "It automatically prosecutes the attackers.",
              "It allows the team to review the incident, identify gaps, and update playbooks to prevent future breaches.",
              "It bypasses regulatory compliance audits.",
              "It is the phase where active backups are initialized."
            ],
            answerIndex: 1,
            explanation: "Without a post-incident review, organizations continue to make the same errors, leaving the initial vulnerability unfixed."
          }
        ]
      },
      {
        id: "4.2",
        title: "Vulnerability Management",
        concepts: `Vulnerability Management is the continuous cycle of identifying, classifying, prioritizing, and remediating security weaknesses.

Assessment Types:
1. **Vulnerability Scanning:** Automated tools searching for missing patches or open ports. Non-intrusive.
2. **Penetration Testing:** Active human attempts to exploit weaknesses. Intrusive.
   - **Black Box:** Tester has zero pre-existing knowledge.
   - **White Box:** Tester has complete knowledge (source code, diagrams).
   - **Gray Box:** Tester has partial knowledge.

CVSS scores vulnerabilities from 0.0 (None) to 10.0 (Critical) based on exploit difficulty and impact.`,
        examTips: [
          "Vulnerability scanning is passive and automated; Penetration testing is active and manual.",
          "Black Box tests give the tester zero pre-existing system information."
        ],
        keyTerms: [
          { term: "CVSS", definition: "Common Vulnerability Scoring System. A standardized numerical rating framework used to define the severity of software vulnerabilities." },
          { term: "Black Box Test", definition: "A penetration test conducted from the perspective of an external attacker, with zero inside knowledge provided." },
          { term: "White Box Test", definition: "A penetration test where the assessor has complete, detailed knowledge of the target systems, environment, and code." }
        ],
        quickQuiz: [
          {
            question: "What is a primary characteristic of a Black Box Penetration Test?",
            options: [
              "The tester is given full source code and network diagrams.",
              "The tester operates with zero prior information about the target's internal systems.",
              "It is fully automated and runs every 24 hours.",
              "It only tests physical locks and building doors."
            ],
            answerIndex: 1,
            explanation: "Black box testing simulates an external adversary, forcing the tester to perform reconnaissance and discovery from scratch."
          },
          {
            question: "How does vulnerability scanning differ from penetration testing?",
            options: [
              "Scanning is an active attempt to exploit weaknesses, whereas penetration testing only runs automated reports.",
              "Scanning is an automated, non-intrusive search for known signatures; penetration testing is an active, human attempt to exploit security vulnerabilities.",
              "Vulnerability scanning is only performed on wireless networks.",
              "Penetration testing never uses software tools."
            ],
            answerIndex: 1,
            explanation: "Scanners identify signature matches passively, while penetration testers manually exploit issues to verify real-world security impact."
          },
          {
            question: "A vulnerability has a CVSS score of 9.8. How should this be classified?",
            options: [
              "Low",
              "Medium",
              "High",
              "Critical"
            ],
            answerIndex: 3,
            explanation: "CVSS scores from 9.0 to 10.0 represent 'Critical' security vulnerabilities requiring immediate prioritization and response."
          }
        ]
      },
      {
        id: "4.3",
        title: "Log Analysis",
        concepts: `Log Analysis processes system messages to detect anomalies, track attacks, and maintain compliance.

Key Log Types:
- **Firewall Logs:** Connection entries (IP, port, action).
- **Active Directory Logs:** Authentications and privilege escalations.
- **Web Server Logs:** Incoming HTTP/HTTPS requests.

Integrity is critical: logs must be sent instantly to centralized SIEM or WORM storage so attackers can't delete their trails.`,
        examTips: [
          "An unusual pattern of multiple failed login attempts followed by a single success is a strong indicator of a successful brute-force attack.",
          "Log integrity is achieved by sending logs immediately offsite or utilizing WORM media so they cannot be altered."
        ],
        keyTerms: [
          { term: "WORM Storage", definition: "Write Once, Read Many. A storage media standard that prevents data deletion or modification after it is written, preserving audit trails." },
          { term: "Brute-Force Fingerprint", definition: "A log pattern characterized by high-frequency authentication failures followed by a successful login." },
          { term: "Syslog", definition: "A standard protocol for sending system health and event notification messages to a central log server." }
        ],
        quickQuiz: [
          {
            question: "Which log pattern is the classic indicator of a successful SSH brute-force attack?",
            options: [
              "A single failure followed by a system shutdown.",
              "A rapid series of authentication failures followed by a single successful login.",
              "Constant, successful active database transactions.",
              "An active memory leak in the web browser."
            ],
            answerIndex: 1,
            explanation: "Repeated failures match the signature of dictionary guessing tools; the single success shows the exact moment the credentials were cracked."
          },
          {
            question: "How can an organization prevent attackers from deleting audit logs after compromising a system?",
            options: [
              "By compressing the logs inside a ZIP file.",
              "By immediately transmitting logs to a secure centralized SIEM utilizing WORM storage.",
              "By deleting trace level alerts.",
              "By running a full backup every 12 months."
            ],
            answerIndex: 1,
            explanation: "WORM storage prevents anyone—including the compromised administrator—from deleting or tampering with logs."
          },
          {
            question: "What type of data is found in a standard corporate firewall log?",
            options: [
              "Employee password history hashes.",
              "Source/destination IP addresses, ports, and action taken (allow/deny).",
              "Solid state drive wear statistics.",
              "SAML assertion XML profiles."
            ],
            answerIndex: 1,
            explanation: "Firewall logs focus on connection data, tracking packets by source, destination, port, protocol, and filter outcome."
          }
        ]
      },
      {
        id: "4.4",
        title: "Backup & Recovery",
        concepts: `Backup and recovery protect organizations against hardware failures, natural disasters, or ransomware.

Three core Backup Types:
1. **Full Backup:** Copies *all* files. Baseline, fast restore, slow backup, high space.
2. **Differential:** Copies changes since the last *Full* backup. Medium restore steps (Full + latest Differential).
3. **Incremental:** Copies changes since the *last backup of any type*. Slowest restore (Full + all Incremental disks in sequence) but fastest to back up.

Backups must be protected from network ransomware via **Air-Gapping** (offline isolation) or **Immutable Backups** (write-once clouds).`,
        examTips: [
          "Differential backups capture all changes since the last Full backup; Incremental backups capture changes since the last backup of any type.",
          "Restoring from a Differential backup only requires 2 items (Full + latest Differential); restoring from an Incremental requires N items."
        ],
        keyTerms: [
          { term: "Differential Backup", definition: "A backup that copies all files changed since the last full backup, requiring only two media sets to perform a full restore." },
          { term: "Incremental Backup", definition: "A backup copying only files changed since the last backup of any kind, resulting in fast backups but complex restorations." },
          { term: "Air-Gapping", definition: "A security measure that physically isolates a system or backup medium from unsecured networks like the internet." }
        ],
        quickQuiz: [
          {
            question: "A company runs a full backup on Sunday, and nightly backups of changes since Sunday's full backup. If a server fails on Thursday, which backups are required to restore?",
            options: [
              "Sunday's full backup + Wednesday's incremental backup",
              "Sunday's full backup + Wednesday's differential backup",
              "Sunday's full backup + Monday, Tuesday, and Wednesday incremental backups",
              "Every single differential backup from the past month"
            ],
            answerIndex: 1,
            explanation: "Since they copy all changes since the last full backup, they are using Differential backups. A restore only requires the Full + the latest Differential (Wednesday)."
          },
          {
            question: "What is a major restoration risk in a weekly full + nightly incremental backup strategy?",
            options: [
              "It consumes the highest disk space.",
              "If any single nightly incremental backup disk is corrupted or missing, the entire restore chain is broken.",
              "It requires a RADIUS server to decrypt.",
              "It cannot be compressed."
            ],
            answerIndex: 1,
            explanation: "Incremental restores depend on a complete, chronologically unbroken chain of all delta disks since the full backup; a single missing link ruins the restore."
          },
          {
            question: "How can an organization ensure that network-wide ransomware cannot access and encrypt backup drives?",
            options: [
              "By formatting backup disks using exFAT.",
              "By implementing isolated offline backups (air-gapping) or immutable cloud locks.",
              "By encrypting the network shares with MD5 checksums.",
              "By disabling change management approvals."
            ],
            answerIndex: 1,
            explanation: "Physical or logical isolation (air-gapping) prevents active malware on network hosts from reaching and deleting historical backup files."
          }
        ]
      }
    ]
  },
  // ==========================================
  // DOMAIN 5: DATA SECURITY & CRYPTOGRAPHY
  // ==========================================
  {
    id: 5,
    title: "Data Security & Cryptography",
    color: "red",
    sections: [
      {
        id: "5.1",
        title: "Data Classification",
        concepts: `Data Classification labels data based on value and impact of compromise.

Standard Corporate Tiers:
1. **Public:** Designed for release (marketing).
2. **Internal:** Memos, directory structures.
3. **Confidential:** Sensitive business info (source code, financial projections).
4. **Restricted:** Critical intellectual property (passwords).

Special Data Types:
- **PII:** Personally Identifiable Information (identities).
- **PHI:** Health records (protected by HIPAA).
- **Cardholder Data (CHD):** Credit card details (protected by PCI-DSS).`,
        examTips: [
          "The first step in any data security or compliance program is performing a Data Inventory and Classification.",
          "Government classification tiers (Top Secret, Secret, Confidential, Unclassified) differ from commercial tiers."
        ],
        keyTerms: [
          { term: "PII", definition: "Personally Identifiable Information. Data elements that can link directly to a specific person's identity." },
          { term: "Data Inventory", definition: "The process of discovering, locating, and documenting all data assets held across the enterprise network." },
          { term: "Top Secret", definition: "Government clearance tier where unauthorized disclosure would cause 'exceptionally grave damage' to national security." }
        ],
        quickQuiz: [
          {
            question: "What is the absolute first step an organization must perform before implementing database encryption or access control policies?",
            options: [
              "Configure a site-to-site IPsec VPN.",
              "Create a complete data inventory and classify the data by sensitivity.",
              "Deploy a wireless deauthentication jammer.",
              "Disable standard Operating Procedures (SOP)."
            ],
            answerIndex: 1,
            explanation: "You cannot protect what you do not know you have. Discovering and classifying data establishes the foundation for all security rules."
          },
          {
            question: "Under the government classification system, which label is used for data whose leakage would cause 'serious damage' to national security?",
            options: [
              "Confidential",
              "Secret",
              "Top Secret",
              "Restricted"
            ],
            answerIndex: 1,
            explanation: "By official definition, 'Secret' is used for serious damage. 'Top Secret' is used for exceptionally grave damage."
          },
          {
            question: "Which of the following contains Personally Identifiable Information (PII)?",
            options: [
              "A company's official corporate logo graphics file.",
              "A list containing customer names, physical home addresses, and social security numbers.",
              "The web server's memory allocation logs.",
              "The public routing tables of the branch office."
            ],
            answerIndex: 1,
            explanation: "PII is defined as any data that uniquely identifies or links directly back to an individual citizen's identity."
          }
        ]
      },
      {
        id: "5.2",
        title: "Cryptographic Algorithms",
        concepts: `Cryptographic algorithms mathematically transform plaintext to ciphertext to secure data.

Core Categories:
1. **Symmetric (Shared Key):** Same key for encrypt/decrypt.
   - **Characteristics:** Extremely fast, bulk data (AES, 3DES, Blowfish).
2. **Asymmetric (Public-Private):** Linked pair. Asymmetric math is slow, used for key exchanges (DH, RSA, ECC).
3. **Hashing (One-Way Checksums):** No keys. Integrity assurance (SHA-256, SHA-3, MD5).`,
        examTips: [
          "Symmetric encryption (AES) is used for bulk data encryption because it is fast; Asymmetric (RSA) is used for key exchange and signatures because it is slow but resolves key sharing issues.",
          "Hashing guarantees Integrity; Encryption guarantees Confidentiality; Digital Signatures guarantee Non-Repudiation."
        ],
        keyTerms: [
          { term: "Symmetric Encryption", definition: "A cryptographic method that uses the same key to encrypt and decrypt data, ideal for bulk databases." },
          { term: "Asymmetric Encryption", definition: "Public-key cryptography that uses linked key pairs (public for encrypting, private for decrypting)." },
          { term: "Hashing", definition: "A one-way mathematical function that converts input data into a secure, fixed-length unique validation checksum." }
        ],
        quickQuiz: [
          {
            question: "Why is symmetric encryption (like AES) preferred over asymmetric encryption (like RSA) for encrypting large databases?",
            options: [
              "Symmetric encryption does not use any mathematical keys.",
              "Symmetric encryption is significantly faster and requires far less processing overhead than asymmetric encryption.",
              "Symmetric encryption provides non-repudiation.",
              "Symmetric encryption runs passively out-of-band."
            ],
            answerIndex: 1,
            explanation: "Asymmetric math involves complex modular exponentiation of massive prime numbers, making it thousands of times slower than symmetric block ciphers."
          },
          {
            question: "Which cryptographic property is defined as proving that a specific user sent a message, preventing them from denying it?",
            options: [
              "Confidentiality",
              "Integrity",
              "Non-Repudiation",
              "Availability"
            ],
            answerIndex: 2,
            explanation: "Non-repudiation is achieved using digital signatures, where the sender signs a hash using their unique private key, proving authorship."
          },
          {
            question: "Which of the following is a secure, modern hashing algorithm widely used for integrity checks?",
            options: [
              "MD5",
              "DES",
              "SHA-256",
              "RSA"
            ],
            answerIndex: 2,
            explanation: "SHA-256 is an industry-standard secure hashing algorithm; MD5 is deprecated, and DES and RSA are encryption algorithms, not hashes."
          }
        ]
      },
      {
        id: "5.3",
        title: "Key Management",
        concepts: `Key Management covers key lifetimes: generation, storage, backup, rotation, and destruction. If a key is leaked, the data is completely exposed.

Core Principles:
1. **Hardware Security Modules (HSMs):** Tamper-proof physical processors for master keys.
2. **Key Rotation:** Periodic replacement. Reduces data loss scope if a key is cracked.
3. **Secrets Management:** Environment injectors rather than hardcoded keys in git (e.g. AWS Secrets Manager).`,
        examTips: [
          "Keys must never be hardcoded in application source repositories (like git/GitHub), as repositories are frequently leaked or publicly indexed.",
          "Hardware Security Modules (HSMs) provide physical and logical tamper-resistant storage for enterprise master keys."
        ],
        keyTerms: [
          { term: "HSM", definition: "Hardware Security Module. A dedicated physical computer processor designed to manage enterprise cryptographic keys securely." },
          { term: "Key Rotation", definition: "The regular lifecycle replacement of active cryptographic keys to reduce compromise risks." },
          { term: "Secrets Manager", definition: "A centralized software repository used to store API keys, passwords, and server secrets securely away from source code files." }
        ],
        quickQuiz: [
          {
            question: "A developer is writing code and needs to access a database password. Where should the password be stored?",
            options: [
              "Hardcoded as a static string variable in the main app file",
              "Saved in a text file named 'credentials.txt' inside the public git directory",
              "Stored in an environment variable or retrieved from a dedicated Secrets Manager at run-time",
              "Hashed using MD5 and written in a comment line"
            ],
            answerIndex: 2,
            explanation: "Separating secrets from source code using environment configs or secrets vaults prevents credentials from being exposed in code repositories."
          },
          {
            question: "What is the primary objective of annual cryptographic Key Rotation?",
            options: [
              "To upgrade database search performance.",
              "To reduce the volume of encrypted data exposed in the event that a single key is compromised.",
              "To change the symmetric algorithm from AES to RSA.",
              "To bypass the need for regular backups."
            ],
            answerIndex: 1,
            explanation: "Rotating keys limits the cryptoperiod, ensuring that if an old key is cracked, newer and older data encrypted with other keys remains safe."
          },
          {
            question: "Which device is specifically designed to perform secure key generation and physical tamper-resistant storage for enterprise networks?",
            options: [
              "A stateful firewall",
              "A Hardware Security Module (HSM)",
              "A RADIUS AAA server",
              "A network TAP monitor"
            ],
            answerIndex: 1,
            explanation: "HSMs are specialized secure hardware modules dedicated to generation, execution, and secure storage of cryptographic keys."
          }
        ]
      },
      {
        id: "5.4",
        title: "Data Destruction",
        concepts: `Data Destruction blocks data leaks from decommissioned media.

Sanitization Methods:
1. **Overwriting:** Repeated patterns across blocks (DoD standards). Reusable.
2. **Degaussing:** Scrambling domains via powerful magnetic fields. Renders magnetic disks blank and physically dead.
3. **Physical:** Pulverizing or melting drives (highest security).

Important Media Differences:
- **Magnetic HDDs:** Scrambled perfectly by degaussing.
- **SSDs:** Electrically charge flash gates. **Degaussing has zero effect**. SSD sanitization requires **Cryptographic Erasure** (deleting decryption keys) or physical disintegration.`,
        examTips: [
          "Degaussing is only effective on magnetic media (HDDs, tapes); it has zero effect on flash media (SSDs, USB drives).",
          "For SSDs, the best practices are Cryptographic Erasure (deleting encryption keys) or physical disintegration."
        ],
        keyTerms: [
          { term: "Degaussing", definition: "A sanitization method that erases data from magnetic media by subjecting it to a powerful magnetic field." },
          { term: "Cryptographic Erasure", definition: "A sanitization technique that renders encrypted data unrecoverable by destroying the cryptographic decryption keys." },
          { term: "Disintegration", definition: "A physical destruction method that shreds silicon chips and drives into tiny particles, essential for SSDs." }
        ],
        quickQuiz: [
          {
            question: "Why is traditional magnetic degaussing ineffective for securing decommissioned Solid State Drives (SSDs)?",
            options: [
              "SSDs contain physical security shields that block magnetic fields.",
              "SSDs store data electrically using silicon transistors, not magnetically.",
              "SSDs are immune to degaussers due to AES encryption rules.",
              "Degaussing works perfectly on SSDs; this is a false statement."
            ],
            answerIndex: 1,
            explanation: "Degaussing scrambles magnetic fields. SSDs store data using electrical charges inside flash memory, which is completely unaffected by magnetism."
          },
          {
            question: "Which data sanitization method allows storage disks to be securely repurposed and reused within the company?",
            options: [
              "Physical shredding",
              "Degaussing",
              "Overwriting (Sanitization)",
              "Dismantling the spindle"
            ],
            answerIndex: 2,
            explanation: "Overwriting rewrites raw sectors with dummy data, rendering historical data unrecoverable while leaving the physical drive functional for future use."
          },
          {
            question: "What does Cryptographic Erasure (Crypto Erase) accomplish?",
            options: [
              "It scrambles the CPU clock cycles.",
              "It renders encrypted drive contents permanently unrecoverable by securely deleting the decryption keys.",
              "It reformats the partition table to FAT32.",
              "It increases the wireless router's signal strength."
            ],
            answerIndex: 1,
            explanation: "Without the keys, AES-encrypted blocks on an SSD become mathematically impossible to decrypt, effectively sanitizing the drive instantly."
          }
        ]
      }
    ]
  }
];
