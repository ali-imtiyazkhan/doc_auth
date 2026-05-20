export interface Option {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  domain: number;
  section: string;
  scenario: string;
  question: string;
  options: [Option, Option, Option, Option];
}

export const questions: Question[] = [
  // --- DOMAIN 1: IDENTITY & ACCESS MANAGEMENT ---
  // Section 1.1: Authentication Mechanisms
  {
    id: "q1",
    domain: 1,
    section: "1.1",
    scenario: "An enterprise is planning to deploy a remote worker portal. The security architect is concerned about credential stuffing attacks and wants to implement a robust multi-factor authentication (MFA) system. They are evaluating different authentication factors.",
    question: "Which of the following describes an authentication factor that relies on 'something you have'?",
    options: [
      {
        text: "A hardware token displaying a time-based one-time password (TOTP)",
        correct: true,
        explanation: "Correct. A physical hardware token is a classic example of the possession factor ('something you have')."
      },
      {
        text: "A complex alphanumeric password changed every 90 days",
        correct: false,
        explanation: "Incorrect. A password is an example of the knowledge factor ('something you know')."
      },
      {
        text: "A facial recognition scan validated against a secure database",
        correct: false,
        explanation: "Incorrect. Biometrics (facial recognition) represent the inherence factor ('something you are')."
      },
      {
        text: "An IP address range validation matching the corporate subnet",
        correct: false,
        explanation: "Incorrect. Location or context ('somewhere you are') is a supplementary attribute, not a direct possession factor."
      }
    ]
  },
  {
    id: "q2",
    domain: 1,
    section: "1.1",
    scenario: "A highly secure research facility requires dual-factor authentication at all entry doors. The facility managers want to combine biometric scanning with a possession factor that cannot be easily cloned or intercepted.",
    question: "Which combination provides the highest defense against physical spoofing and unauthorized entry?",
    options: [
      {
        text: "A Smart Card with an embedded cryptographic chip and a fingerprint scan featuring liveness detection",
        correct: true,
        explanation: "Correct. A cryptographic smart card provides high cloning resistance, and liveness detection prevents fingerprint spoofing using rubber molds."
      },
      {
        text: "A standard magnetic stripe ID card and a PIN code typed on a keypad",
        correct: false,
        explanation: "Incorrect. Magnetic stripe cards are trivial to clone, and PIN codes can be visually shoulder-surfed, failing biometric requirements."
      },
      {
        text: "A proximity RFID badge and a voice recognition scan",
        correct: false,
        explanation: "Incorrect. Standard RFID tags can be easily copied at a distance, and voice recognition can be bypassed with high-quality recordings."
      },
      {
        text: "A digital OTP sent via SMS text message and a retina scan",
        correct: false,
        explanation: "Incorrect. SMS is highly vulnerable to SIM swapping and interception, making it a weak second factor for a high-security physical door."
      }
    ]
  },
  // Section 1.2: Authorization Frameworks
  {
    id: "q3",
    domain: 1,
    section: "1.2",
    scenario: "A hospital needs to restrict access to electronic health records (EHR). The rules state that doctors can view medical records only if they are the assigned physician for the patient, and only during their active shift hours from hospital-owned devices.",
    question: "Which authorization model is best suited to enforce these dynamic, context-aware constraints?",
    options: [
      {
        text: "Attribute-Based Access Control (ABAC)",
        correct: true,
        explanation: "Correct. ABAC evaluates attributes (user role, patient assignment, shift time, device ownership) to make dynamic, real-time access decisions."
      },
      {
        text: "Role-Based Access Control (RBAC)",
        correct: false,
        explanation: "Incorrect. Standard RBAC only checks static user roles (e.g., 'Doctor'), which cannot naturally evaluate time, device, or specific patient relationships without role explosion."
      },
      {
        text: "Discretionary Access Control (DAC)",
        correct: false,
        explanation: "Incorrect. DAC allows the owner of the data to define permissions, which does not enforce hospital-wide safety policies or context rules."
      },
      {
        text: "Mandatory Access Control (MAC)",
        correct: false,
        explanation: "Incorrect. MAC is based on clear security clearances and data labels (e.g., Secret, Confidential) rather than relationships, time, and device types."
      }
    ]
  },
  {
    id: "q4",
    domain: 1,
    section: "1.2",
    scenario: "A banking application uses a Microservices architecture. Developers need to delegate limited authority so that a third-party budget tracking tool can read account balances but cannot make transactions or modify profile details.",
    question: "Which protocol should be implemented to securely manage this delegation of authorization?",
    options: [
      {
        text: "OAuth 2.0",
        correct: true,
        explanation: "Correct. OAuth 2.0 is an industry-standard framework designed precisely for delegation of authorization, providing scopes to limit third-party access."
      },
      {
        text: "SAML 2.0",
        correct: false,
        explanation: "Incorrect. SAML is used primarily for Single Sign-On (federated authentication), not delegated authorization with fine-grained API scopes."
      },
      {
        text: "LDAP",
        correct: false,
        explanation: "Incorrect. LDAP is a directory querying protocol, not an API-driven authorization delegation protocol."
      },
      {
        text: "RADIUS",
        correct: false,
        explanation: "Incorrect. RADIUS is a networking AAA protocol (Authentication, Authorization, Accounting) for dial-in or VPN services."
      }
    ]
  },
  // Section 1.3: User Lifecycle Management
  {
    id: "q5",
    domain: 1,
    section: "1.3",
    scenario: "An employee leaves a company to join a direct competitor. The HR department initiates the termination process, but due to a communication delay, the employee's VPN credentials remain active for 48 hours, during which proprietary source code is downloaded.",
    question: "Which component of the user lifecycle management framework would have directly prevented this window of vulnerability?",
    options: [
      {
        text: "Automated, immediate identity deprovisioning triggered by HR database updates",
        correct: true,
        explanation: "Correct. Automated deprovisioning links HR event triggers directly to directories, immediately disabling VPN and cloud accounts without manual delay."
      },
      {
        text: "An annual user access review and re-certification campaign",
        correct: false,
        explanation: "Incorrect. Annual reviews are valuable for compliance, but are too slow to mitigate immediate risks associated with employee termination."
      },
      {
        text: "Enforcing stronger password complexity and rotational rules",
        correct: false,
        explanation: "Incorrect. Password complexity does not address the core issue of account active/inactive state synchronization during offboarding."
      },
      {
        text: "Using a Self-Service Password Reset (SSPR) portal",
        correct: false,
        explanation: "Incorrect. SSPR helps users reset forgotten passwords, which is irrelevant to termination and accounts deletion."
      }
    ]
  },
  {
    id: "q6",
    domain: 1,
    section: "1.3",
    scenario: "During an external security audit, the auditor discovers that several users in the accounting department have accumulated administrative rights to customer billing databases and sales tools, which they do not require for their current day-to-day responsibilities.",
    question: "This accumulation of excess permissions over time is known as 'privilege creep'. Which process is best designed to detect and remediate this?",
    options: [
      {
        text: "Regular User Access Certifications (Attestation)",
        correct: true,
        explanation: "Correct. User access certifications (or attestations) require managers to review and justify all permissions held by their staff, pruning unnecessary rights."
      },
      {
        text: "Just-In-Time (JIT) Provisioning",
        correct: false,
        explanation: "Incorrect. JIT creates accounts on-the-fly when a user first signs in, but doesn't manage or audit permission accumulation over time."
      },
      {
        text: "Dynamic Directory Group Nesting",
        correct: false,
        explanation: "Incorrect. Group nesting makes administration easier, but without audits, it actually increases the risk of accidental privilege creep."
      },
      {
        text: "Single Sign-On (SSO) integration",
        correct: false,
        explanation: "Incorrect. SSO centralizes entry, but does not audit or prune internal account authorization privileges."
      }
    ]
  },
  // Section 1.4: Single Sign-On (SSO)
  {
    id: "q7",
    domain: 1,
    section: "1.4",
    scenario: "A SaaS company wants to implement Single Sign-On (SSO) so that enterprise customers can log in to the company's web app using their corporate Active Directory credentials. The connection must use standard XML-based security assertions.",
    question: "Which of the following standards is the most appropriate selection for this integration?",
    options: [
      {
        text: "SAML 2.0 (Security Assertion Markup Language)",
        correct: true,
        explanation: "Correct. SAML 2.0 is the industry-standard XML-based protocol specifically used for secure federated Single Sign-On (SSO)."
      },
      {
        text: "OpenID Connect (OIDC)",
        correct: false,
        explanation: "Incorrect. OIDC is highly popular, but it is built on top of OAuth 2.0 and uses JSON/JWT (JSON Web Tokens), not XML-based assertions."
      },
      {
        text: "Kerberos",
        correct: false,
        explanation: "Incorrect. Kerberos is an intranet-based tickets authentication protocol, not ideal for standard web-based SaaS federations."
      },
      {
        text: "WS-Federation",
        correct: false,
        explanation: "Incorrect. While WS-Federation is XML-based, SAML 2.0 has far wider modern adoption and support in SaaS integrations."
      }
    ]
  },
  {
    id: "q8",
    domain: 1,
    section: "1.4",
    scenario: "An organization implements OpenID Connect (OIDC) for their customer-facing mobile application. During authentication, the mobile client receives multiple tokens from the Identity Provider (IdP).",
    question: "What is the primary purpose of the 'ID Token' in an OpenID Connect flow?",
    options: [
      {
        text: "It contains claims about the identity of the authenticated user in a cryptographically signed JSON Web Token (JWT) format.",
        correct: true,
        explanation: "Correct. The ID Token in OIDC is a JWT containing assertion claims about the user (e.g., email, name) for consumption by the client application."
      },
      {
        text: "It is sent to the backend API resource server in the Authorization header to permit API requests.",
        correct: false,
        explanation: "Incorrect. The Access Token (not the ID Token) is used to authorize requests sent to the backend API resource server."
      },
      {
        text: "It is used by the client to request a new token set once the active session expires without re-prompting the user.",
        correct: false,
        explanation: "Incorrect. The Refresh Token is used to silently acquire new tokens once the active ones expire."
      },
      {
        text: "It encrypts the communication channel between the client browser and the resource database.",
        correct: false,
        explanation: "Incorrect. Channel security is handled by HTTPS (TLS), not by specific OIDC identity tokens."
      }
    ]
  },

  // --- DOMAIN 2: NETWORK & INFRASTRUCTURE SECURITY ---
  // Section 2.1: Network Architecture & Segmentation
  {
    id: "q9",
    domain: 2,
    section: "2.1",
    scenario: "A e-commerce retailer operates a public web server and a backend database containing cardholder data. An architect is designing a network segment to isolate the database from public exposure.",
    question: "Where should the database server be located in accordance with standard network design and security frameworks?",
    options: [
      {
        text: "In a private internal subnet, with access restricted via internal firewalls to only accept connections from the web server in the DMZ.",
        correct: true,
        explanation: "Correct. Database servers should never be directly accessible from the public internet. Placing them in a private internal subnet behind a DMZ is the standard architecture."
      },
      {
        text: "Directly in the Demilitarized Zone (DMZ) along with the web server for high performance.",
        correct: false,
        explanation: "Incorrect. Placing databases in the DMZ exposes them to public exposure if the DMZ firewalls are misconfigured or web servers are compromised."
      },
      {
        text: "In a public subnet with an open security group to allow rapid sync operations.",
        correct: false,
        explanation: "Incorrect. Databases must never reside on a public subnet, as it drastically increases risk of SQL injection exploitation and direct compromise."
      },
      {
        text: "Directly on a virtual bridge network shared with the public router.",
        correct: false,
        explanation: "Incorrect. This bypasses firewalls completely, leaving the database completely vulnerable."
      }
    ]
  },
  {
    id: "q10",
    domain: 2,
    section: "2.1",
    scenario: "An enterprise is planning to adopt microsegmentation within its software-defined data center (SDDC) to isolate virtual machines hosting different application tiers.",
    question: "What is the primary operational security benefit of microsegmentation?",
    options: [
      {
        text: "It limits lateral movement (East-West traffic) in the event that an attacker compromises a single host.",
        correct: true,
        explanation: "Correct. Microsegmentation applies security policies to individual workloads, blocking lateral (East-West) movement inside the network perimeter."
      },
      {
        text: "It improves external WAN bandwidth throughput by dividing broadcast domains.",
        correct: false,
        explanation: "Incorrect. Microsegmentation is an isolation and security control, not a WAN network optimization or bandwidth booster."
      },
      {
        text: "It automatically encrypts all internal hard disks at the hypervisor layer.",
        correct: false,
        explanation: "Incorrect. Microsegmentation manages network traffic, not data encryption at rest."
      },
      {
        text: "It replaces the need for a web application firewall (WAF) at the perimeter.",
        correct: false,
        explanation: "Incorrect. Microsegmentation does not inspect HTTP payloads or defend against application exploits, which still requires a WAF."
      }
    ]
  },
  // Section 2.2: Threat Detection & Prevention
  {
    id: "q11",
    domain: 2,
    section: "2.2",
    scenario: "A SOC team observes an alert showing that an internal client is sending rapid, repetitive HTTP POST requests to an unknown IP in another country, containing structured binary payloads, indicating potential data exfiltration.",
    question: "Which of the following devices is best capable of automatically blocking this connection in real-time based on payload analysis?",
    options: [
      {
        text: "An Intrusion Prevention System (IPS)",
        correct: true,
        explanation: "Correct. An IPS sits in-line and can actively drop packets, block traffic, or reset connections when threat signatures or anomalies are identified."
      },
      {
        text: "An Intrusion Detection System (IDS)",
        correct: false,
        explanation: "Incorrect. An IDS is passive (out-of-band) and can only alert administrators; it cannot directly block network packets in real-time."
      },
      {
        text: "A stateful packet filtering router",
        correct: false,
        explanation: "Incorrect. A stateful router filters based on port/IP and connection states, but does not analyze payloads for threat signature patterns."
      },
      {
        text: "A passive network TAP",
        correct: false,
        explanation: "Incorrect. A TAP simply copies traffic for offline analysis, doing nothing to block active threats."
      }
    ]
  },
  {
    id: "q12",
    domain: 2,
    section: "2.2",
    scenario: "A security operations manager wants to aggregate logs from network firewalls, active directories, endpoint detection agents, and web applications to perform real-time correlation and incident alerting.",
    question: "Which technology is specifically built to fulfill this log aggregation and correlation requirement?",
    options: [
      {
        text: "Security Information and Event Management (SIEM)",
        correct: true,
        explanation: "Correct. SIEM platforms aggregate logs, correlate events across disparate systems, and generate automated security alerts."
      },
      {
        text: "Network Address Translation (NAT)",
        correct: false,
        explanation: "Incorrect. NAT simply translates private IPs to public IPs at the network boundary."
      },
      {
        text: "Simple Network Management Protocol (SNMP)",
        correct: false,
        explanation: "Incorrect. SNMP is used to monitor device health, bandwidth, and CPU utilization, not for security log correlation."
      },
      {
        text: "Data Loss Prevention (DLP)",
        correct: false,
        explanation: "Incorrect. DLP inspects egress data to prevent unauthorized leakage, but does not serve as a central log aggregator/SIEM."
      }
    ]
  },
  // Section 2.3: Encryption in Transit
  {
    id: "q13",
    domain: 2,
    section: "2.3",
    scenario: "A company wants to secure connection channels between a remote branch office and the primary cloud data center. The solution must encrypt all network layer traffic automatically without requiring client software on individual workstations.",
    question: "Which technology is the most appropriate selection to accomplish this branch-to-cloud security?",
    options: [
      {
        text: "IPsec Site-to-Site VPN in Tunnel Mode",
        correct: true,
        explanation: "Correct. A site-to-site IPsec VPN in Tunnel Mode encrypts all packet payloads and original headers between gateway routers, requiring no client-side setup."
      },
      {
        text: "SSL/TLS Client VPN (e.g., OpenVPN)",
        correct: false,
        explanation: "Incorrect. Client-to-site VPNs require client software to be installed and managed on individual client endpoints."
      },
      {
        text: "HTTPS Web Proxy",
        correct: false,
        explanation: "Incorrect. Web proxies only handle HTTP/HTTPS application-level traffic, leaving other protocols and ports unencrypted."
      },
      {
        text: "SSH Remote Forwarding tunnel",
        correct: false,
        explanation: "Incorrect. SSH forwarding is an ad-hoc port redirection mechanism, not suitable or scalable for encrypting all branch network traffic."
      }
    ]
  },
  {
    id: "q14",
    domain: 2,
    section: "2.3",
    scenario: "A developer is configuring a secure web portal and must choose a cryptographic cipher suite for TLS 1.3 that guarantees 'Perfect Forward Secrecy' (PFS).",
    question: "Which key exchange mechanism satisfies this requirement?",
    options: [
      {
        text: "Ephemeral Diffie-Hellman (ECDHE)",
        correct: true,
        explanation: "Correct. Ephemeral key exchanges generate unique keys for every single session, ensuring that a compromise of the private server key cannot decrypt historical traffic."
      },
      {
        text: "Static RSA key exchange",
        correct: false,
        explanation: "Incorrect. Static RSA uses the server's long-term private key for key exchange, which means a future compromise of that private key exposes all past captured sessions."
      },
      {
        text: "MD5 Hashed Key Exchange",
        correct: false,
        explanation: "Incorrect. MD5 is an insecure, broken hashing algorithm, not a secure key exchange mechanism."
      },
      {
        text: "Pre-Shared Keys (PSK)",
        correct: false,
        explanation: "Incorrect. PSK relies on a static shared key, which does not provide Ephemeral Forward Secrecy."
      }
    ]
  },
  // Section 2.4: Wireless Security
  {
    id: "q15",
    domain: 2,
    section: "2.4",
    scenario: "A corporation wants to secure its internal corporate wireless network. They want to avoid using a single shared password (WPA3-Personal) and instead authenticate every user individually using their Active Directory credentials.",
    question: "Which wireless security configuration must be deployed?",
    options: [
      {
        text: "WPA3-Enterprise using 802.1X and a RADIUS server",
        correct: true,
        explanation: "Correct. WPA3-Enterprise relies on the 802.1X standard and a backend RADIUS server to authenticate wireless clients individually."
      },
      {
        text: "WPA2-PSK (Pre-Shared Key) with MAC filtering",
        correct: false,
        explanation: "Incorrect. MAC filtering is easily spoofed, and PSK still uses a single shared password across all corporate devices."
      },
      {
        text: "WPA3-SAE (Simultaneous Authentication of Equals)",
        correct: false,
        explanation: "Incorrect. WPA3-SAE is the consumer 'Personal' standard replacing standard PSK, but it still utilizes a shared password rather than individual corporate accounts."
      },
      {
        text: "WEP with Shared Key Authentication (SKA)",
        correct: false,
        explanation: "Incorrect. WEP is long-deprecated, severely insecure, and trivial to crack within minutes."
      }
    ]
  },
  {
    id: "q16",
    domain: 2,
    section: "2.4",
    scenario: "An administrator detects a rogue access point (AP) operating within the office building. The rogue AP is broadcasting the corporate SSID and performing a man-in-the-middle attack to harvest employee credentials.",
    question: "Which technique is best suited to prevent clients from connecting to this rogue AP?",
    options: [
      {
        text: "Deploying a Wireless Intrusion Prevention System (WIPS) that sends deauthentication frames to rogue-connected clients",
        correct: true,
        explanation: "Correct. WIPS detects unauthorized APs and can actively block connections by broadcasting wireless deauthentication packets to isolate targets."
      },
      {
        text: "Enabling SSID broadcasting suppression on the corporate routers",
        correct: false,
        explanation: "Incorrect. Hiding the SSID does not stop rogue APs from broadcasting the SSID themselves and tricking nearby devices."
      },
      {
        text: "Applying static IP addresses to all corporate laptop devices",
        correct: false,
        explanation: "Incorrect. Dynamic or static IPs are negotiated after connection, which does not prevent laptops from establishing physical connections to rogue APs."
      },
      {
        text: "Re-keying the corporate firewalls every 24 hours",
        correct: false,
        explanation: "Incorrect. Firewall key cycles have no impact on wireless client-to-AP physical layer association choices."
      }
    ]
  },

  // --- DOMAIN 3: GOVERNANCE, RISK & COMPLIANCE ---
  // Section 3.1: Regulatory Compliance
  {
    id: "q17",
    domain: 3,
    section: "3.1",
    scenario: "A European software firm processes the names, emails, and physical location coordinates of European citizens. The company wants to ensure strict compliance with regional data protection acts.",
    question: "Which regulation defines 'the right to be forgotten' and enforces strict geographic boundaries on this data?",
    options: [
      {
        text: "General Data Protection Regulation (GDPR)",
        correct: true,
        explanation: "Correct. GDPR is a European Union regulation that strictly defines data privacy rights, including data portability and the right to erasure (forgotten)."
      },
      {
        text: "Health Insurance Portability and Accountability Act (HIPAA)",
        correct: false,
        explanation: "Incorrect. HIPAA regulates protected health information (PHI) within the United States medical sector."
      },
      {
        text: "Payment Card Industry Data Security Standard (PCI-DSS)",
        correct: false,
        explanation: "Incorrect. PCI-DSS is an industry standard governing companies handling credit cardholder data, not regional data privacy laws."
      },
      {
        text: "Sarbanes-Oxley Act (SOX)",
        correct: false,
        explanation: "Incorrect. SOX is a US federal law that establishes financial auditing and reporting standards for public corporations."
      }
    ]
  },
  {
    id: "q18",
    domain: 3,
    section: "3.1",
    scenario: "A cloud-based SaaS vendor wishes to prove to corporate clients that they have robust security controls in place to protect customer data, evaluated by an independent third-party CPA firm.",
    question: "Which audit report is specifically designed to provide a public or detailed confidential breakdown of internal security, availability, and confidentiality controls over a testing period?",
    options: [
      {
        text: "SOC 2 Type II Report",
        correct: true,
        explanation: "Correct. A SOC 2 Type II report evaluates the design and operating effectiveness of security controls over a period of time (usually 6 months or more)."
      },
      {
        text: "SOC 1 Type I Report",
        correct: false,
        explanation: "Incorrect. SOC 1 focuses strictly on financial reporting controls, and Type I only assesses control design at a single point in time."
      },
      {
        text: "ISO 9001 Certificate",
        correct: false,
        explanation: "Incorrect. ISO 9001 relates to generic quality management principles, not deep cyber security audit certifications."
      },
      {
        text: "PCI DSS Self-Assessment Questionnaire (SAQ-A)",
        correct: false,
        explanation: "Incorrect. SAQ-A is a self-completed form for merchants who outsource all cardholder data processing, not a CPA audited report."
      }
    ]
  },
  // Section 3.2: Risk Assessment
  {
    id: "q19",
    domain: 3,
    section: "3.2",
    scenario: "A risk manager is calculating the potential loss from a primary datacenter flood. The asset value of the datacenter is $2,000,000. History shows that a major flood occurs once every 10 years, causing 50% damage to the physical servers and structure.",
    question: "What is the Single Loss Expectancy (SLE) and Annualized Loss Expectancy (ALE) for this risk scenario?",
    options: [
      {
        text: "SLE = $1,000,000; ALE = $100,000",
        correct: true,
        explanation: "Correct. SLE = Asset Value ($2M) × Exposure Factor (0.50) = $1,000,000. ALE = SLE ($1M) × Annualized Rate of Occurrence (0.1) = $100,000."
      },
      {
        text: "SLE = $500,000; ALE = $50,000",
        correct: false,
        explanation: "Incorrect. The exposure factor is 50%, making the single loss $1,000,000, not $500,000."
      },
      {
        text: "SLE = $1,000,000; ALE = $1,000,000",
        correct: false,
        explanation: "Incorrect. The flood only happens once in 10 years (ARO = 0.1), so the annualized loss expectancy is divided by 10, resulting in $100,000."
      },
      {
        text: "SLE = $2,000,000; ALE = $200,000",
        correct: false,
        explanation: "Incorrect. SLE assumes 50% damage (exposure factor = 0.5), not 100% total destruction."
      }
    ]
  },
  {
    id: "q20",
    domain: 3,
    section: "3.2",
    scenario: "A company decides that the cost of implementing a redundant power generator ($50,000/year) is higher than the potential loss of a brief power outage ($10,000/year). The executive board decides to accept the risk without adding controls.",
    question: "This risk management strategy is formally classified as:",
    options: [
      {
        text: "Risk Acceptance",
        correct: true,
        explanation: "Correct. Risk acceptance occurs when an organization evaluates a risk and decides to bear the consequences without taking further action to mitigate it."
      },
      {
        text: "Risk Mitigation",
        correct: false,
        explanation: "Incorrect. Mitigation involves deploying active controls (like generators) to reduce the likelihood or impact of the threat."
      },
      {
        text: "Risk Transference",
        correct: false,
        explanation: "Incorrect. Transference shifts the risk burden to another party, typically via insurance or outsourcing."
      },
      {
        text: "Risk Avoidance",
        correct: false,
        explanation: "Incorrect. Avoidance involves eliminating the risk completely by stopping the activity that creates the risk (e.g., closing the datacenter)."
      }
    ]
  },
  // Section 3.3: Security Policies
  {
    id: "q21",
    domain: 3,
    section: "3.3",
    scenario: "A newly hired systems administrator wants to know what actions are permitted when using corporate computers, including whether personal web browsing or personal email access is allowed.",
    question: "Which corporate document would contain these rules and dictate acceptable user behaviors?",
    options: [
      {
        text: "Acceptable Use Policy (AUP)",
        correct: true,
        explanation: "Correct. An AUP defines what employees can and cannot do using company-owned computing systems and networks."
      },
      {
        text: "Standard Operating Procedure (SOP)",
        correct: false,
        explanation: "Incorrect. SOPs are step-by-step instructions for IT tasks, not policy definitions for employee conduct."
      },
      {
        text: "Non-Disclosure Agreement (NDA)",
        correct: false,
        explanation: "Incorrect. NDAs protect corporate intellectual property and confidential information from being shared externally."
      },
      {
        text: "Service Level Agreement (SLA)",
        correct: false,
        explanation: "Incorrect. SLAs define performance, uptime, and availability standards between a provider and a client."
      }
    ]
  },
  {
    id: "q22",
    domain: 3,
    section: "3.2", // mapped logically to Section 3.3 policy logic
    scenario: "A security analyst is writing a password policy. The goal is to enforce security settings that prevent an attacker from guessing passwords offline via dictionary attacks if a hash database is stolen.",
    question: "Which combination of policy settings provides the best defense against offline brute-forcing?",
    options: [
      {
        text: "Strong hashing algorithms (e.g., bcrypt/Argon2) combined with high minimum character length rules",
        correct: true,
        explanation: "Correct. Long passwords increase key space exponentially, and slow key-derivation algorithms (bcrypt/Argon2) make offline cracking highly computationally expensive."
      },
      {
        text: "Enforcing character rotations every 30 days and using SHA-1 hashes",
        correct: false,
        explanation: "Incorrect. Frequent password expiration leads to users choosing predictable patterns, and SHA-1 is extremely fast to crack offline."
      },
      {
        text: "Enabling account lockout thresholds after 5 failed attempts",
        correct: false,
        explanation: "Incorrect. Account lockout thresholds only protect against online login attempts; they do not hinder offline cracking if the database of hashes is stolen."
      },
      {
        text: "Supressing the display of passwords in the browser during input",
        correct: false,
        explanation: "Incorrect. Masking password inputs prevents over-the-shoulder viewing, but has no effect on offline mathematical dictionary attacks."
      }
    ]
  },
  // Section 3.4: Business Continuity
  {
    id: "q23",
    domain: 3,
    section: "3.4",
    scenario: "A business impact analysis (BIA) indicates that the company will suffer unacceptable financial losses if the primary database is offline for more than 4 hours. Additionally, they cannot afford to lose more than 1 hour of transaction data.",
    question: "What are the Recovery Time Objective (RTO) and Recovery Point Objective (RPO) targets based on these requirements?",
    options: [
      {
        text: "RTO = 4 hours; RPO = 1 hour",
        correct: true,
        explanation: "Correct. RTO is the target time to restore systems (4 hours max offline). RPO is the maximum acceptable data age lost (1 hour max data loss)."
      },
      {
        text: "RTO = 1 hour; RPO = 4 hours",
        correct: false,
        explanation: "Incorrect. This reverses the definitions of Recovery Time (how long to recover) and Recovery Point (how far back to restore data)."
      },
      {
        text: "RTO = 4 hours; RPO = 4 hours",
        correct: false,
        explanation: "Incorrect. The RPO target is 1 hour of data loss, not 4."
      },
      {
        text: "RTO = 24 hours; RPO = 12 hours",
        correct: false,
        explanation: "Incorrect. These parameters would violate both business limits stated in the scenario."
      }
    ]
  },
  {
    id: "q24",
    domain: 3,
    section: "3.4",
    scenario: "A disaster recovery planner wants to test the response team's ability to coordinate and recover critical systems during a simulated earthquake, without causing any actual downtime or system disruptions.",
    question: "Which test type should be conducted to minimize operational risk while thoroughly validating team procedures?",
    options: [
      {
        text: "Tabletop exercise or structured walk-through",
        correct: true,
        explanation: "Correct. Tabletop exercises involve stakeholders discussing scenarios in a meeting room, testing coordination without modifying production networks."
      },
      {
        text: "Full parallel simulation test",
        correct: false,
        explanation: "Incorrect. A parallel test actually deploys systems at the backup site, which consumes significant resources and introduces configuration changes."
      },
      {
        text: "Full cutover interruption test",
        correct: false,
        explanation: "Incorrect. Cutover tests shut down the primary datacenter and route traffic to the DR site, introducing a high risk of actual downtime."
      },
      {
        text: "Checklist test",
        correct: false,
        explanation: "Incorrect. A checklist test is passive (reviewing documents), but is less interactive and thorough than a coordinated tabletop scenario."
      }
    ]
  },

  // --- DOMAIN 4: SECURITY OPERATIONS ---
  // Section 4.1: Incident Response
  {
    id: "q25",
    domain: 4,
    section: "4.1",
    scenario: "A security analyst notices active ransomware encrypting files on a department server. The analyst immediately disconnects the network cable from the server to prevent the malware from reaching other segments.",
    question: "Under which phase of the standard Incident Response lifecycle does this action fall?",
    options: [
      {
        text: "Containment",
        correct: true,
        explanation: "Correct. Containment focuses on limiting the damage and stopping the spread of the incident (e.g., severing network links)."
      },
      {
        text: "Eradication",
        correct: false,
        explanation: "Incorrect. Eradication involves removing the threat (e.g., deleting malware, formatting infected disks), which happens after containment."
      },
      {
        text: "Detection and Analysis",
        correct: false,
        explanation: "Incorrect. This phase involves discovering and assessing the event, which occurred before isolating the system."
      },
      {
        text: "Post-Incident Activity (Lessons Learned)",
        correct: false,
        explanation: "Incorrect. This happens after the threat is resolved, to review actions taken and improve policies."
      }
    ]
  },
  {
    id: "q26",
    domain: 4,
    section: "4.1",
    scenario: "During a major data breach, a hacker accesses customer passwords. The IR team must decide how to handle notifications. Legal guidelines require immediate disclosure if PII was exposed.",
    question: "What is the most critical first step for the incident commander before notifying the public?",
    options: [
      {
        text: "Verify that the breach is fully contained and secure, preventing further data loss during notification.",
        correct: true,
        explanation: "Correct. If you notify the public while the breach is still actively leaking data, attackers may escalate or exploit additional channels before you secure the systems."
      },
      {
        text: "Immediately delete all system logs to hide operational weaknesses from regulators.",
        correct: false,
        explanation: "Incorrect. Deleting logs is illegal, violates compliance rules, and destroys critical forensic evidence."
      },
      {
        text: "Run a full vulnerability scan across the entire corporate WAN.",
        correct: false,
        explanation: "Incorrect. Full WAN scans are slow and consume resources, which is not the priority during immediate containment and notification decisions."
      },
      {
        text: "Restore all production backups immediately over the active infection.",
        correct: false,
        explanation: "Incorrect. Restoring over an active infection will just result in the new backups being encrypted or compromised immediately."
      }
    ]
  },
  // Section 4.2: Vulnerability Management
  {
    id: "q27",
    domain: 4,
    section: "4.2",
    scenario: "A security scanner identifies a critical vulnerability (CVSS score 9.8) in an apache web server hosting a secondary, low-traffic blog site. The system administrator wants to patch it, but discovers the patch will break custom styling scripts.",
    question: "According to standard vulnerability management practices, what should the administrator do?",
    options: [
      {
        text: "Implement compensating controls (e.g., WAF rules) to block exploits, or schedule patch installation during the next maintenance window after scripting updates.",
        correct: true,
        explanation: "Correct. If a patch breaks critical software, administrators should implement compensating controls to mitigate the exploit path while prep work is done."
      },
      {
        text: "Ignore the vulnerability because the blog site is low-traffic and has low business value.",
        correct: false,
        explanation: "Incorrect. Low-value sites are often used as entry points by attackers to pivot and move laterally into higher-security networks."
      },
      {
        text: "Immediately delete the web server operating system.",
        correct: false,
        explanation: "Incorrect. Deleting the entire OS is an extreme reaction that destroys business services unnecessarily."
      },
      {
        text: "Downgrade the CVSS score to Low in the scanner database to satisfy compliance audits.",
        correct: false,
        explanation: "Incorrect. Tampering with scan reports to bypass compliance is unethical, insecure, and represents fraudulent activity."
      }
    ]
  },
  {
    id: "q28",
    domain: 4,
    section: "4.2",
    scenario: "An organization wants to perform a realistic security test where the testing team is given no information about the network architecture, IP ranges, or operating systems beforehand, mimicking an external threat actor.",
    question: "This testing methodology is known as a:",
    options: [
      {
        text: "Black Box Penetration Test",
        correct: true,
        explanation: "Correct. A black box test provides zero pre-existing knowledge to the testers, evaluating external security defenses from scratch."
      },
      {
        text: "White Box Penetration Test",
        correct: false,
        explanation: "Incorrect. A white box test provides full architecture, source code, and network layouts to the testers for exhaustive internal reviews."
      },
      {
        text: "Gray Box Penetration Test",
        correct: false,
        explanation: "Incorrect. A gray box test provides limited information (e.g., standard user credentials or specific host IPs) but not full network maps."
      },
      {
        text: "Passive Vulnerability Scan",
        correct: false,
        explanation: "Incorrect. Vulnerability scanning is automated software searching for signatures; it is not a manual, active penetration testing team methodology."
      }
    ]
  },
  // Section 4.3: Log Analysis
  {
    id: "q29",
    domain: 4,
    section: "4.3",
    scenario: "A system engineer is reviewing security logs. They notice an unusual series of login failures on a SSH server, followed immediately by a single successful login. The server is located in the DMZ.",
    question: "What does this log pattern most likely indicate?",
    options: [
      {
        text: "A successful brute-force or dictionary attack against the SSH service.",
        correct: true,
        explanation: "Correct. A series of failures followed by a single success is the classic log fingerprint of a successful automated brute-force attack."
      },
      {
        text: "A standard SSH key-exchange timeout negotiation.",
        correct: false,
        explanation: "Incorrect. Timeouts do not generate multiple authentication failure entries followed by a successful credentials validation."
      },
      {
        text: "An active DDoS attack overloading the NIC buffer.",
        correct: false,
        explanation: "Incorrect. DDoS attacks focus on resource exhaustion, not successful authenticated entries."
      },
      {
        text: "A routine database indexing operation.",
        correct: false,
        explanation: "Incorrect. Database indexes do not involve external SSH connection attempts or credentials parsing logs."
      }
    ]
  },
  {
    id: "q30",
    domain: 4,
    section: "4.3",
    scenario: "An organization must comply with strict compliance laws requiring them to retain all security event logs for a minimum of 7 years, but the primary SIEM server runs out of high-speed disk space every 3 months.",
    question: "What is the most cost-effective log storage architecture that maintains regulatory compliance?",
    options: [
      {
        text: "Moving logs older than 90 days to cold cloud storage (e.g., Amazon S3 Glacier or equivalent WORM archive) with long-term retention policies.",
        correct: true,
        explanation: "Correct. Archiving older logs to cold storage keeps them compliant for 7 years at extremely low cost while freeing up active high-speed index disks."
      },
      {
        text: "Deleting all debug and trace level logs, and only retaining alerts that have high severity.",
        correct: false,
        explanation: "Incorrect. Regulatory requirements often demand complete transaction and security audit trails, not just custom selected high alerts."
      },
      {
        text: "Buying expensive high-speed SSD SAN arrays every quarter to maintain active indexing.",
        correct: false,
        explanation: "Incorrect. Purchasing active high-speed storage for historical logs that are rarely queried is not cost-effective."
      },
      {
        text: "Compressing logs and storing them on local USB thumb drives kept in the IT manager's desk.",
        correct: false,
        explanation: "Incorrect. Unsecured USB drives are easily lost, damaged, lack write-once-read-many (WORM) controls, and violate standard enterprise chain of custody."
      }
    ]
  },
  // Section 4.4: Backup & Recovery
  {
    id: "q31",
    domain: 4,
    section: "4.4",
    scenario: "An administrator performs a full backup of all servers every Sunday night at 11:00 PM. During the week, they want to run a nightly backup that captures only the files that have changed since that Sunday full backup.",
    question: "Which backup type should be configured for the weekday runs to minimize restore steps?",
    options: [
      {
        text: "Differential Backup",
        correct: true,
        explanation: "Correct. Differential backups capture all changes since the last *full* backup. Restoring requires only the full backup and the latest differential backup."
      },
      {
        text: "Incremental Backup",
        correct: false,
        explanation: "Incorrect. Incremental backups capture changes since the last backup of *any* type. Restoring requires the full backup and *every* subsequent nightly incremental backup, which is slower."
      },
      {
        text: "Synthetic Full Backup",
        correct: false,
        explanation: "Incorrect. Synthetic backups compile active change logs into a new full backup image offline, which is not a simple nightly delta run."
      },
      {
        text: "Mirror Backup",
        correct: false,
        explanation: "Incorrect. Mirror backups are real-time exact copies that immediately delete files if they are deleted on the source, offering no point-in-time recovery."
      }
    ]
  },
  {
    id: "q32",
    domain: 4,
    section: "4.4",
    scenario: "A ransomware attack encrypts all online files, including the active network shares. The administrator attempts to restore from backups, but discovers the backup agent itself was infected, and all online NAS backup disks were also encrypted.",
    question: "Which architectural principle was violated in this backup strategy?",
    options: [
      {
        text: "Offline/Immutable Backups (e.g., air-gapping or write-once storage)",
        correct: true,
        explanation: "Correct. Backups must be isolated (air-gapped) or stored on immutable media to prevent malware on the network from accessing and deleting them."
      },
      {
        text: "Backup Encryption-at-Rest using AES-256",
        correct: false,
        explanation: "Incorrect. Encrypted backups can still be overwritten, deleted, or double-encrypted by ransomware if they remain accessible online."
      },
      {
        text: "The Principle of Least Privilege for backup operators",
        correct: false,
        explanation: "Incorrect. While important, standard network shares are accessed via compromised domain administrator accounts, which air-gapping directly mitigates physically."
      },
      {
        text: "Using a high compression ratio to save storage costs",
        correct: false,
        explanation: "Incorrect. Backup compression has no relation to network isolation or ransomware defense."
      }
    ]
  },

  // --- DOMAIN 5: DATA SECURITY & CRYPTOGRAPHY ---
  // Section 5.1: Data Classification
  {
    id: "q33",
    domain: 5,
    section: "5.1",
    scenario: "A marketing specialist downloads a list containing customer phone numbers, home addresses, and credit card transaction histories to their personal laptop to draft a customer reward mailing list.",
    question: "How should this data be classified, and what risk does this action present?",
    options: [
      {
        text: "Classified as PII (Personally Identifiable Information) and PCI; placing it on an unmanaged laptop violates data protection standards.",
        correct: true,
        explanation: "Correct. Phone numbers, addresses, and purchase histories constitute PII and cardholder data. Storing this on personal devices is a major security violation."
      },
      {
        text: "Classified as Public; because phone numbers are in public directories, there is zero security risk.",
        correct: false,
        explanation: "Incorrect. Credit card transactions and home addresses are private and protected, not public information."
      },
      {
        text: "Classified as Proprietary; it only affects internal company sales strategies.",
        correct: false,
        explanation: "Incorrect. While it contains business value, the presence of customer identities makes it PII and subject to privacy laws."
      },
      {
        text: "Classified as Unclassified; marketing materials are exempt from corporate classification policies.",
        correct: false,
        explanation: "Incorrect. No customer list containing identities is exempt from corporate classification and protection rules."
      }
    ]
  },
  {
    id: "q34",
    domain: 5,
    section: "5.1",
    scenario: "A government agency uses a four-tier classification system: Top Secret, Secret, Confidential, and Unclassified. An officer is handling a document that, if disclosed, would cause 'serious damage' to national security.",
    question: "Under which classification tier should this document be categorized?",
    options: [
      {
        text: "Secret",
        correct: true,
        explanation: "Correct. By official definition in national security frameworks, 'Secret' is used for information that could cause 'serious damage' to national security if leaked. ('Top Secret' is for 'exceptionally grave damage')."
      },
      {
        text: "Top Secret",
        correct: false,
        explanation: "Incorrect. Top Secret is reserved for information whose unauthorized disclosure would cause 'exceptionally grave damage' to national security."
      },
      {
        text: "Confidential",
        correct: false,
        explanation: "Incorrect. Confidential is used for information whose unauthorized disclosure could cause 'damage' to national security, not serious damage."
      },
      {
        text: "Restricted",
        correct: false,
        explanation: "Incorrect. Restricted is not one of the standard four tiers used in the US government classification scheme, though used internationally."
      }
    ]
  },
  // Section 5.2: Cryptographic Algorithms
  {
    id: "q35",
    domain: 5,
    section: "5.2",
    scenario: "A database administrator is encrypting an entire database containing medical records at rest. The encryption must be extremely fast, support bulk operations, and be highly secure.",
    question: "Which cryptographic algorithm is the best selection for this bulk database encryption?",
    options: [
      {
        text: "AES (Advanced Encryption Standard)",
        correct: true,
        explanation: "Correct. AES is a symmetric block cipher, meaning it uses the same key for encryption/decryption, making it extremely fast and suitable for bulk data."
      },
      {
        text: "RSA (Rivest-Shamir-Adleman)",
        correct: false,
        explanation: "Incorrect. RSA is an asymmetric algorithm. Asymmetric encryption is highly resource-intensive and extremely slow, making it totally unsuitable for bulk data encryption."
      },
      {
        text: "MD5 (Message Digest 5)",
        correct: false,
        explanation: "Incorrect. MD5 is a hashing algorithm (one-way), not an encryption algorithm; it cannot decrypt data."
      },
      {
        text: "Diffie-Hellman",
        correct: false,
        explanation: "Incorrect. Diffie-Hellman is a key exchange protocol used to establish a shared secret, not an algorithm for bulk data encryption."
      }
    ]
  },
  {
    id: "q36",
    domain: 5,
    section: "5.2",
    scenario: "A developer wants to verify that a file downloaded from a remote server has not been tampered with or corrupted during transit. They decide to compare a cryptographic value.",
    question: "Which mathematical function should be utilized to generate this verification value?",
    options: [
      {
        text: "A cryptographic hash function (e.g., SHA-256)",
        correct: true,
        explanation: "Correct. A cryptographic hash function is a one-way mathematical function that produces a unique, fixed-size output for any file input, serving as a digital fingerprint."
      },
      {
        text: "A symmetric block cipher (e.g., DES)",
        correct: false,
        explanation: "Incorrect. DES is an encryption cipher used to hide data, not a hashing function used to generate a simple checksum validation."
      },
      {
        text: "An asymmetric signature envelope (e.g., RSA-OAEP)",
        correct: false,
        explanation: "Incorrect. Asymmetric padding schemes are used during public-key encryption processes, not for direct file download verification hashes."
      },
      {
        text: "A linear regression checksum",
        correct: false,
        explanation: "Incorrect. Linear regression is a statistical modeling technique, not a cryptographic data validation function."
      }
    ]
  },
  // Section 5.3: Key Management
  {
    id: "q37",
    domain: 5,
    section: "5.3",
    scenario: "A financial processing company uses a Hardware Security Module (HSM) to generate, store, and manage their master encryption keys. The security policy demands that keys are rotated annually.",
    question: "What is the primary security benefit of implementing annual key rotation?",
    options: [
      {
        text: "It limits the amount of encrypted data compromised if a single key is ever exposed or cracked.",
        correct: true,
        explanation: "Correct. Key rotation reduces the cryptoperiod, ensuring that if a key is compromised, only the data encrypted during that specific key's active timeframe is exposed."
      },
      {
        text: "It speeds up database search queries by compressing historical keys.",
        correct: false,
        explanation: "Incorrect. Key rotation has no positive effect on search query speeds or data compression."
      },
      {
        text: "It replaces the need to implement access controls on HSM management dashboards.",
        correct: false,
        explanation: "Incorrect. Rotations do not replace proper dashboard authentication and role-based permissions."
      },
      {
        text: "It automatically updates old cryptographic algorithms to new standards.",
        correct: false,
        explanation: "Incorrect. Key rotation rotates the key value itself; it does not change the underlying algorithm (e.g., AES to RSA) unless the codebase is refactored."
      }
    ]
  },
  {
    id: "q38",
    domain: 5,
    section: "5.3",
    scenario: "During an audit, it is found that developers are storing AWS API access keys directly in their git repository code files, which are pushed to a public GitHub repository.",
    question: "Which of the following describes the best remediation practice to secure these credentials?",
    options: [
      {
        text: "Remove the keys from the code, rotate them in AWS, and store them securely using environment variables or a dedicated Secrets Manager.",
        correct: true,
        explanation: "Correct. Exposed keys must be immediately rotated (invalidated) because public repos are scraped by bots instantly. Moving them to env variables or Secrets Managers prevents future exposure."
      },
      {
        text: "Leave the keys in the code but change the GitHub repository status from Public to Private.",
        correct: false,
        explanation: "Incorrect. Changing status does not delete historical commits containing the key, and keeping secrets in git remains a major risk."
      },
      {
        text: "Encrypt the code file containing the keys using symmetric AES and keying the developers locally.",
        correct: false,
        explanation: "Incorrect. Encrypting source files is highly impractical, breaks git differentials, and is far inferior to using standard environment configurations."
      },
      {
        text: "Rename the API key variable name in the code to something obscure like 'temp_value'.",
        correct: false,
        explanation: "Incorrect. Renaming variables does not hide the actual string value of the key from attackers or scanning tools."
      }
    ]
  },
  // Section 5.4: Data Destruction
  {
    id: "q39",
    domain: 5,
    section: "5.4",
    scenario: "A defense contractor is decommissioning several magnetic hard disk drives (HDDs) that previously held highly classified military documents. They must ensure that the data is completely unrecoverable, even using magnetic force microscopy in a specialized laboratory.",
    question: "Which data destruction method should be applied to these magnetic disks?",
    options: [
      {
        text: "Degaussing, followed by physical destruction (shredding/melting)",
        correct: true,
        explanation: "Correct. Degaussing uses strong magnetic fields to completely erase magnetic domains. For high-security military records, combining degaussing with physical shredding is the standard."
      },
      {
        text: "Performing a standard full format in Windows Disk Utility",
        correct: false,
        explanation: "Incorrect. A standard format only deletes index tables; raw data sectors remain intact and can be recovered easily using basic forensic software."
      },
      {
        text: "Deleting all directories and clearing the Recycle Bin",
        correct: false,
        explanation: "Incorrect. Standard deletion only unallocates space; the actual binary bits remain completely untouched on the platter."
      },
      {
        text: "Encrypting the drive with BitLocker and then throwing it in the local recycling bin",
        correct: false,
        explanation: "Incorrect. Leaving physical media intact in public trash exposes it to potential brute-forcing, physical capture, or recovery if keys are leaked."
      }
    ]
  },
  {
    id: "q40",
    domain: 5,
    section: "5.4",
    scenario: "An IT team is upgrading to Solid State Drives (SSDs). They want to decommission the old SSDs securely, but they learn that traditional magnetic degaussers are completely ineffective on flash-based silicon memory chips.",
    question: "Why is degaussing ineffective on SSDs, and what is the proper secure decommissioning method?",
    options: [
      {
        text: "SSDs store data electrically using floating-gate transistors rather than magnetic domains; secure deletion requires cryptographic erasure (Crypto Erase) or physical disintegration.",
        correct: true,
        explanation: "Correct. SSDs use flash transistors, not magnetic platters. Degaussers do nothing to them. Crypto Erase (deleting keys) or disintegration (shredding chips to small bits) is the proper method."
      },
      {
        text: "SSDs are protected by high-density lead shielding that blocks magnetic fields; they must be soaked in chemical solvents.",
        correct: false,
        explanation: "Incorrect. SSDs do not contain lead shielding. Chemical soaking is dangerous, toxic, and is not a standard data destruction method."
      },
      {
        text: "SSD blocks are self-healing and restore charge patterns automatically; they must be burned in an open fire.",
        correct: false,
        explanation: "Incorrect. SSD chips do not self-heal data, and burning electronics in open fires releases highly toxic gases and is not an approved industrial method."
      },
      {
        text: "SSDs require high-voltage electrical shocks to discharge; they must be formatted using FAT32 formats.",
        correct: false,
        explanation: "Incorrect. Formatting FAT32 is an operating system organization, not an electrical discharge secure destruction mechanism."
      }
    ]
  }
];
