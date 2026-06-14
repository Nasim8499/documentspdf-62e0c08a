// Country-aware document builders for HR / immigration / operations docs.
import { DocData, DocSection, setDoc, getDoc } from "./docStore";

export type BuilderType =
  | "contract"
  | "offer"
  | "passport"
  | "visa"
  | "workorder"
  | "acknowledgement"
  | "company"
  | "employment";

export interface BuilderField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "date" | "number" | "select";
  placeholder?: string;
  options?: string[];
  countrySpecific?: Partial<Record<string, Partial<BuilderField>>>;
  required?: boolean;
}

export interface BuilderConfig {
  type: BuilderType;
  title: string;
  description: string;
  gradient: "primary" | "sunset" | "ocean" | "mint" | "candy";
  fields: BuilderField[];
  /** Country-specific extra fields appended after base fields */
  extraByCountry?: Record<string, BuilderField[]>;
  build: (values: Record<string, string>, country: string) => Partial<DocData>;
}

export const COUNTRIES: { code: string; name: string; flag: string; currency: string }[] = [
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY" },
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY" },
];

const countryClause = (country: string, map: Record<string, string>, fallback: string) =>
  map[country] || fallback;

// ------------- Contract Builder -------------
const contract: BuilderConfig = {
  type: "contract",
  title: "Employment Contract",
  description: "Country-aware employment contract generator",
  gradient: "primary",
  fields: [
    { key: "employer", label: "Employer / Company", required: true, placeholder: "Acme Corp" },
    { key: "employee", label: "Employee Full Name", required: true },
    { key: "position", label: "Job Title / Position", required: true },
    { key: "startDate", label: "Start Date", type: "date", required: true },
    { key: "salary", label: "Annual Salary", type: "number", required: true },
    { key: "workHours", label: "Weekly Working Hours", type: "number", placeholder: "40" },
    { key: "probation", label: "Probation Period (months)", type: "number", placeholder: "3" },
    { key: "location", label: "Place of Work", placeholder: "City, Office" },
  ],
  extraByCountry: {
    AE: [{ key: "molNumber", label: "MOHRE / Labour Card No." }],
    SA: [{ key: "iqama", label: "Iqama / Border No." }],
    GB: [{ key: "niNumber", label: "National Insurance No." }],
    US: [{ key: "ssn", label: "SSN (last 4)", placeholder: "****" }],
    IN: [{ key: "pan", label: "PAN Number" }],
  },
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const law = countryClause(
      c,
      {
        US: "the laws of the State of Delaware, United States",
        GB: "the laws of England and Wales",
        AE: "UAE Federal Decree-Law No. 33 of 2021 on Labour Relations",
        SA: "the Saudi Labor Law issued by Royal Decree No. M/51",
        IN: "the Indian Contract Act, 1872 and applicable labour codes",
        DE: "the German Civil Code (Bürgerliches Gesetzbuch / BGB)",
        FR: "the French Code du travail",
        CA: "the Canada Labour Code",
        AU: "the Fair Work Act 2009 (Cth)",
        SG: "the Employment Act of Singapore",
        PK: "the Industrial and Commercial Employment Ordinance, 1968",
        BD: "the Bangladesh Labour Act, 2006",
        JP: "the Labour Standards Act of Japan",
        CN: "the Labour Contract Law of the People's Republic of China",
      },
      "applicable employment laws"
    );
    const notice = countryClause(c, { AE: "30 days", SA: "60 days", GB: "1 month", US: "2 weeks", DE: "4 weeks" }, "30 days");
    const leave = countryClause(c, { AE: "30 calendar days", SA: "21 days", GB: "28 days", US: "15 business days", IN: "21 days" }, "20 days");

    const sections: DocSection[] = [
      {
        heading: "1. Parties",
        body: `This Employment Contract ("Agreement") is entered into by and between ${v.employer || "[Employer]"} ("Employer") and ${v.employee || "[Employee]"} ("Employee"), governed by ${law}.`,
      },
      {
        heading: "2. Position & Duties",
        body: `The Employee is engaged in the role of ${v.position || "[Position]"} based at ${v.location || "the Employer's premises"}. Duties shall be performed faithfully and to the best of the Employee's ability.`,
      },
      {
        heading: "3. Term & Probation",
        body: `Employment commences on ${v.startDate || "[Start Date]"} and continues until terminated. The first ${v.probation || "3"} months constitute a probationary period during which either party may terminate with shorter notice.`,
      },
      {
        heading: "4. Compensation",
        body: `Annual gross salary: ${country.currency} ${Number(v.salary || 0).toLocaleString()}, payable in 12 equal monthly instalments via bank transfer, subject to statutory deductions under ${country.name} law.`,
      },
      {
        heading: "5. Working Hours & Leave",
        body: `Standard working week: ${v.workHours || 40} hours. Paid annual leave: ${leave}. Public holidays as prescribed by ${country.name} regulations.`,
      },
      {
        heading: "6. Confidentiality",
        body: `The Employee shall not disclose confidential information, trade secrets, or proprietary data of the Employer during or after employment.`,
      },
      {
        heading: "7. Termination",
        body: `Either party may terminate this Agreement by providing ${notice} written notice. Summary dismissal is permitted for gross misconduct as defined under ${law}.`,
      },
      {
        heading: "8. Governing Law",
        body: `This Agreement shall be governed by and construed in accordance with ${law}. Disputes shall be resolved through the competent courts of ${country.name}.`,
      },
      {
        heading: "9. Signatures",
        body: `Signed for and on behalf of the Employer: _______________________\n\nSigned by the Employee (${v.employee || "[Employee]"}): _______________________\n\nDate: ${new Date().toLocaleDateString()}`,
      },
    ];
    return {
      title: `Employment Contract — ${v.employee || "Employee"}`,
      subtitle: `Between ${v.employer || "Employer"} and ${v.employee || "Employee"} · ${country.flag} ${country.name}`,
      author: v.employer || "Employer",
      client: v.employee || "Employee",
      sections,
    };
  },
};

// ------------- Offer Letter Builder -------------
const offer: BuilderConfig = {
  type: "offer",
  title: "Offer Letter",
  description: "Professional offer letters by country",
  gradient: "sunset",
  fields: [
    { key: "company", label: "Hiring Company", required: true },
    { key: "candidate", label: "Candidate Name", required: true },
    { key: "position", label: "Position Offered", required: true },
    { key: "startDate", label: "Proposed Start Date", type: "date", required: true },
    { key: "salary", label: "Annual Compensation", type: "number", required: true },
    { key: "bonus", label: "Sign-on Bonus", type: "number" },
    { key: "reportTo", label: "Reporting Manager" },
    { key: "deadline", label: "Acceptance Deadline", type: "date" },
  ],
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const benefits = countryClause(
      c,
      {
        US: "401(k) match, medical/dental/vision insurance, 15 days PTO",
        GB: "Workplace pension (auto-enrolled), private medical insurance, 28 days holiday",
        AE: "Medical insurance, end-of-service gratuity, annual flight allowance",
        SA: "GOSI registration, medical insurance, end-of-service award",
        IN: "Provident Fund (EPF), gratuity, group medical insurance",
        DE: "Statutory health insurance, pension contributions, 30 days vacation",
      },
      "Standard statutory benefits"
    );

    return {
      title: `Offer of Employment — ${v.candidate || "Candidate"}`,
      subtitle: `${v.position || "Position"} at ${v.company || "Company"} · ${country.flag} ${country.name}`,
      author: v.company || "Hiring Team",
      client: v.candidate || "Candidate",
      sections: [
        {
          heading: "1. Congratulations",
          body: `Dear ${v.candidate || "Candidate"},\n\nWe are delighted to offer you the position of ${v.position || "[Position]"} at ${v.company || "[Company]"}. We were impressed with your experience and believe you will be a valuable addition to our team.`,
        },
        {
          heading: "2. Position & Reporting",
          body: `You will report to ${v.reportTo || "your designated line manager"} and will be based at our ${country.name} office. Your start date will be ${v.startDate || "[Start Date]"}.`,
        },
        {
          heading: "3. Compensation",
          body: `Annual base compensation: ${country.currency} ${Number(v.salary || 0).toLocaleString()}.${v.bonus ? `\nSign-on bonus: ${country.currency} ${Number(v.bonus).toLocaleString()}, payable on completion of probation.` : ""}`,
        },
        {
          heading: "4. Benefits",
          body: benefits + ". Detailed benefits booklet will be shared on onboarding.",
        },
        {
          heading: "5. Conditions",
          body: `This offer is contingent on: (a) verification of work authorisation in ${country.name}; (b) satisfactory reference and background checks; (c) signing of the standard confidentiality and IP assignment agreements.`,
        },
        {
          heading: "6. Acceptance",
          body: `Please confirm your acceptance by countersigning and returning this letter by ${v.deadline || "[Deadline]"}. We look forward to welcoming you on board.\n\nSincerely,\n${v.company || "[Company]"} — Talent Team`,
        },
      ],
    };
  },
};

// ------------- Passport Auto-Fill -------------
const passport: BuilderConfig = {
  type: "passport",
  title: "Passport Application",
  description: "Auto-filled passport application by country",
  gradient: "ocean",
  fields: [
    { key: "surname", label: "Surname", required: true },
    { key: "givenNames", label: "Given Names", required: true },
    { key: "dob", label: "Date of Birth", type: "date", required: true },
    { key: "pob", label: "Place of Birth", required: true },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "X"] },
    { key: "nationality", label: "Nationality" },
    { key: "address", label: "Residential Address", type: "textarea" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "applicationType", label: "Application Type", type: "select", options: ["New", "Renewal", "Replacement (Lost/Damaged)"] },
  ],
  extraByCountry: {
    IN: [
      { key: "aadhaar", label: "Aadhaar Number" },
      { key: "fileType", label: "File Type", type: "select", options: ["Normal", "Tatkaal"] },
    ],
    US: [{ key: "ssn", label: "Social Security Number" }],
    GB: [{ key: "niNumber", label: "National Insurance No." }],
    AE: [{ key: "emiratesId", label: "Emirates ID Number" }],
    PK: [{ key: "cnic", label: "CNIC" }],
    BD: [{ key: "nid", label: "National ID (NID)" }],
  },
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const office = countryClause(
      c,
      {
        IN: "Regional Passport Office (Ministry of External Affairs)",
        US: "U.S. Department of State — Passport Services",
        GB: "His Majesty's Passport Office",
        AE: "ICP — Federal Authority for Identity & Citizenship",
        PK: "Directorate General of Immigration & Passports",
        BD: "Department of Immigration and Passports",
      },
      `${country.name} Passport Authority`
    );
    return {
      title: `Passport Application — ${v.surname || ""} ${v.givenNames || ""}`.trim(),
      subtitle: `${v.applicationType || "New"} application · ${country.flag} ${country.name}`,
      author: office,
      client: `${v.surname || ""} ${v.givenNames || ""}`.trim() || "Applicant",
      sections: [
        {
          heading: "Section A — Personal Particulars",
          body: `Surname: ${v.surname || "—"}\nGiven Names: ${v.givenNames || "—"}\nDate of Birth: ${v.dob || "—"}\nPlace of Birth: ${v.pob || "—"}\nGender: ${v.gender || "—"}\nNationality: ${v.nationality || country.name}`,
        },
        {
          heading: "Section B — Contact Information",
          body: `Residential Address:\n${v.address || "—"}\n\nPhone: ${v.phone || "—"}\nEmail: ${v.email || "—"}`,
        },
        {
          heading: "Section C — Country-Specific Identifiers",
          body: Object.entries(v)
            .filter(([k]) => ["aadhaar", "fileType", "ssn", "niNumber", "emiratesId", "cnic", "nid"].includes(k))
            .map(([k, val]) => `${k.toUpperCase()}: ${val || "—"}`)
            .join("\n") || `No additional identifiers required for ${country.name}.`,
        },
        {
          heading: "Section D — Declaration",
          body: `I, ${v.surname || ""} ${v.givenNames || ""}, declare that the information provided above is true and correct to the best of my knowledge. I understand that providing false information is an offence under the laws of ${country.name}.\n\nSignature: _______________________\nDate: ${new Date().toLocaleDateString()}`,
        },
        {
          heading: "Section E — Submission",
          body: `Submit this application to: ${office}.\nApplication type: ${v.applicationType || "New"}.\nProcessing fees and biometric appointment requirements vary by category and locality.`,
        },
      ],
    };
  },
};

// ------------- Visa Form Builder -------------
const visa: BuilderConfig = {
  type: "visa",
  title: "Visa Application",
  description: "Country-specific visa form generator",
  gradient: "candy",
  fields: [
    { key: "fullName", label: "Full Name (as in Passport)", required: true },
    { key: "passportNo", label: "Passport Number", required: true },
    { key: "passportExpiry", label: "Passport Expiry", type: "date", required: true },
    { key: "nationality", label: "Current Nationality", required: true },
    { key: "visaType", label: "Visa Category", type: "select", options: ["Tourist", "Business", "Work", "Student", "Family / Dependent", "Transit"] },
    { key: "purpose", label: "Purpose of Visit", type: "textarea" },
    { key: "duration", label: "Intended Duration (days)", type: "number" },
    { key: "arrival", label: "Date of Arrival", type: "date" },
    { key: "sponsor", label: "Sponsor / Host" },
    { key: "fundsUsd", label: "Available Funds (USD)", type: "number" },
  ],
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const issuer = countryClause(
      c,
      {
        US: "U.S. Embassy / Consulate (DS-160)",
        GB: "UK Visas & Immigration (UKVI)",
        AE: "ICP / GDRFA — UAE",
        SA: "Saudi Ministry of Foreign Affairs",
        IN: "Bureau of Immigration, Government of India",
        SG: "Immigration & Checkpoints Authority (ICA)",
      },
      `${country.name} immigration authority`
    );
    return {
      title: `${v.visaType || "Visa"} Application — ${country.name}`,
      subtitle: `Applicant: ${v.fullName || "—"} · Passport ${v.passportNo || "—"}`,
      author: issuer,
      client: v.fullName || "Applicant",
      sections: [
        {
          heading: "Part 1 — Applicant Information",
          body: `Full Name: ${v.fullName || "—"}\nNationality: ${v.nationality || "—"}\nPassport No.: ${v.passportNo || "—"}\nPassport Expiry: ${v.passportExpiry || "—"}`,
        },
        {
          heading: "Part 2 — Visa Details",
          body: `Visa Type: ${v.visaType || "—"}\nIntended Duration: ${v.duration || "—"} days\nDate of Arrival: ${v.arrival || "—"}\nPurpose of Visit:\n${v.purpose || "—"}`,
        },
        {
          heading: "Part 3 — Sponsor & Financials",
          body: `Sponsor / Host in ${country.name}: ${v.sponsor || "Self-sponsored"}\nDeclared Funds: USD ${Number(v.fundsUsd || 0).toLocaleString()}`,
        },
        {
          heading: "Part 4 — Supporting Documents Checklist",
          body: `• Valid passport (min. 6 months validity)\n• Recent passport-size photographs (white background)\n• Confirmed travel itinerary & accommodation\n• Bank statements for the last 3–6 months\n• Visa fee payment receipt\n• Country-specific: ${countryClause(c, { US: "DS-160 confirmation", GB: "TLS / VFS appointment letter", AE: "Emirates ID copy if resident", IN: "Online registration receipt (e-Visa)" }, "Local annexes as required")}`,
        },
        {
          heading: "Part 5 — Declaration",
          body: `I declare that all information provided is true and accurate. I understand that misrepresentation may result in refusal of this application and a ban from entering ${country.name}.\n\nSignature: _______________________\nDate: ${new Date().toLocaleDateString()}\n\nSubmit to: ${issuer}.`,
        },
      ],
    };
  },
};

// ------------- Work Order PDF -------------
const workorder: BuilderConfig = {
  type: "workorder",
  title: "Work Order",
  description: "Issue an official work order / job order",
  gradient: "mint",
  fields: [
    { key: "orderNo", label: "Work Order No.", required: true, placeholder: "WO-2026-001" },
    { key: "issuer", label: "Issuing Company", required: true },
    { key: "contractor", label: "Contractor / Vendor", required: true },
    { key: "scope", label: "Scope of Work", type: "textarea", required: true },
    { key: "site", label: "Site / Location", required: true },
    { key: "start", label: "Start Date", type: "date" },
    { key: "end", label: "Completion Date", type: "date" },
    { key: "amount", label: "Order Value", type: "number" },
    { key: "paymentTerms", label: "Payment Terms", placeholder: "Net 30" },
  ],
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    return {
      title: `Work Order ${v.orderNo || ""}`.trim(),
      subtitle: `${v.issuer || "Issuer"} → ${v.contractor || "Contractor"} · ${country.flag} ${country.name}`,
      author: v.issuer || "Issuer",
      client: v.contractor || "Contractor",
      sections: [
        {
          heading: "1. Order Reference",
          body: `Work Order Number: ${v.orderNo || "—"}\nIssue Date: ${new Date().toLocaleDateString()}\nJurisdiction: ${country.name}`,
        },
        {
          heading: "2. Parties",
          body: `Issuer: ${v.issuer || "—"}\nContractor: ${v.contractor || "—"}`,
        },
        {
          heading: "3. Scope of Work",
          body: v.scope || "Scope to be detailed.",
        },
        {
          heading: "4. Site & Schedule",
          body: `Site / Location: ${v.site || "—"}\nStart Date: ${v.start || "—"}\nCompletion Date: ${v.end || "—"}`,
        },
        {
          heading: "5. Commercial Terms",
          body: `Order Value: ${country.currency} ${Number(v.amount || 0).toLocaleString()}\nPayment Terms: ${v.paymentTerms || "Net 30"}\nTaxes: As applicable under ${country.name} law.`,
        },
        {
          heading: "6. Conditions",
          body: `The Contractor shall execute the scope diligently, comply with all health, safety and environmental regulations of ${country.name}, and indemnify the Issuer against any third-party claims arising out of negligence.`,
        },
        {
          heading: "7. Acceptance & Authorisation",
          body: `For ${v.issuer || "Issuer"}: _______________________   Date: ____________\n\nAccepted by ${v.contractor || "Contractor"}: _______________________   Date: ____________`,
        },
      ],
    };
  },
};

// ------------- Acknowledgement PDF -------------
const acknowledgement: BuilderConfig = {
  type: "acknowledgement",
  title: "Acknowledgement Receipt",
  description: "Acknowledgement of receipt / handover",
  gradient: "primary",
  fields: [
    { key: "issuedTo", label: "Issued To", required: true },
    { key: "issuedBy", label: "Issued By", required: true },
    { key: "subject", label: "Subject / Item", required: true },
    { key: "reference", label: "Reference No." },
    { key: "amount", label: "Amount (if any)", type: "number" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "date", label: "Date of Acknowledgement", type: "date" },
  ],
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    return {
      title: `Acknowledgement — ${v.subject || "Receipt"}`,
      subtitle: `Issued by ${v.issuedBy || "—"} to ${v.issuedTo || "—"} · ${country.flag} ${country.name}`,
      author: v.issuedBy || "Issuer",
      client: v.issuedTo || "Recipient",
      sections: [
        {
          heading: "Acknowledgement of Receipt",
          body: `Reference: ${v.reference || "—"}\nDate: ${v.date || new Date().toLocaleDateString()}\n\nThis is to acknowledge that ${v.issuedTo || "the Recipient"} has received from ${v.issuedBy || "the Issuer"} the following:`,
        },
        {
          heading: "Details",
          body: `Subject / Item: ${v.subject || "—"}\nDescription:\n${v.description || "—"}${v.amount ? `\n\nAmount: ${country.currency} ${Number(v.amount).toLocaleString()}` : ""}`,
        },
        {
          heading: "Declaration",
          body: `The Recipient confirms that the above item / amount has been received in good order and condition. This acknowledgement is issued in accordance with the laws of ${country.name} and shall serve as conclusive evidence of receipt.`,
        },
        {
          heading: "Signatures",
          body: `Received by (${v.issuedTo || "Recipient"}): _______________________   Date: ____________\n\nIssued by (${v.issuedBy || "Issuer"}): _______________________   Date: ____________`,
        },
      ],
    };
  },
};

// ------------- Company Profile (VisaHOBe-style 10 page) -------------
const VISAHOBE_BRAND = {
  name: "VisaHOBe PTE. LTD.",
  color: "#0B0B0C",
  accent: "#94886E",
};

const company: BuilderConfig = {
  type: "company",
  title: "Company Profile",
  description: "10-page corporate profile (VisaHOBe-style)",
  gradient: "sunset",
  fields: [
    { key: "companyName", label: "Company Name", required: true, placeholder: "VisaHOBe PTE. LTD." },
    { key: "tagline", label: "Tagline", placeholder: "Global Recruiter & Visa Consultancy Partner" },
    { key: "uen", label: "Registration / UEN", placeholder: "202524173E" },
    { key: "hqAddress", label: "HQ Address", type: "textarea", placeholder: "68 Circular Road, #02-01, 049422, Singapore" },
    { key: "branchAddress", label: "Branch Address", type: "textarea", placeholder: "Gulshan, Dhaka, Bangladesh" },
    { key: "website", label: "Website", placeholder: "visahobe.com" },
    { key: "email", label: "Email", placeholder: "contact@visahobe.com" },
    { key: "phone", label: "Phone", placeholder: "+1 (323) 601-8257" },
    { key: "founded", label: "Founded", placeholder: "2025" },
    { key: "industries", label: "Industries Served", placeholder: "Construction, Manufacturing, Service" },
    { key: "countries", label: "Countries Served", type: "textarea", placeholder: "Singapore, Australia, Cambodia, Serbia, Russia, Belarus, Kuwait, Bahrain" },
    { key: "workersCount", label: "Active Workers Pool", type: "number", placeholder: "70" },
    { key: "docRef", label: "Document Reference", placeholder: "VHB-CP-2026" },
  ],
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const name = v.companyName || "VisaHOBe PTE. LTD.";
    const tagline = v.tagline || "Global Recruiter & Visa Consultancy Partner";
    const countries = v.countries || "Singapore, Australia, Cambodia, Serbia, Russia, Belarus, Kuwait, Bahrain";
    return {
      title: `${name} — Corporate Profile`,
      subtitle: tagline,
      author: name,
      client: "Global Partners & Employers",
      sections: [
        {
          heading: "01 · Company Introduction",
          body: `${name} is a ${country.name}-registered Global Recruiter and Visa Consultancy Partner managing international manpower coordination, visa guidance, documentation support, and client mobility.\n\nRegistration: ${v.uen || "—"}\nFounded: ${v.founded || "2025"}\nHeadquarters: ${v.hqAddress || "—"}\nBranch: ${v.branchAddress || "—"}\n\nOur primary objective is to connect skilled workforce from South Asia with international employers through a transparent, compliance-first, long-term ecosystem.`,
        },
        {
          heading: "02 · Our Vision",
          body: `To establish ${name} as the most trusted, transparent, compliant and long-term partner in the international labor market and visa service sector — a world where skilled workers have equitable access to global opportunities and employers can confidently source talent through professional, ethical channels.`,
        },
        {
          heading: "03 · Our Mission",
          body: `• Provide international-standard documentation support with meticulous attention to detail.\n• Maintain an ethical manpower coordination model that prioritizes worker welfare.\n• Ensure transparent visa guidance and dedicated client support.\n• Create realistic pathways through risk-aware professional consultation.\n• Build a sustainable global ecosystem of employers, workers and processing partners.`,
        },
        {
          heading: "04 · Core Values",
          body: `01. Integrity — Honest, reliable communication.\n02. Transparency — Full process visibility at every step.\n03. Compliance — Adherence to all legal mandates.\n04. Excellence — Elite standards and attention to detail.`,
        },
        {
          heading: "05 · What We Offer",
          body: `A — Manpower Recruitment & Coordination: skilled / semi-skilled sourcing, screening, documentation, employer matching.\n\nB — Visa Consultancy & Travel Support: work, student, tourist and business visas across multiple jurisdictions.\n\nC — Documentation & Compliance: attestation, translation, verification and authority-grade file packaging.`,
        },
        {
          heading: "06 · Global Reach",
          body: `Recruitment coordination and visa consultancy services across destination countries: ${countries}.`,
        },
        {
          heading: "07 · Our Process",
          body: `1. Client Consultation — Goals & skill assessment.\n2. Roadmap Planning — Scope & timeline definition.\n3. Document Verification — Review & authentication.\n4. File Preparation — Authority-standard packaging.\n5. Submission Tracking — Application & progress filing.\n6. Post-Visa Support — Relocation & liaison.`,
        },
        {
          heading: "08 · Why Choose Us",
          body: `Transparent Process — Full case updates at all times.\nProfessional Files — Authority-approved file standards.\nCompliance-First — Legal safety across borders.\nLong-Term Goals — Ethical, sustainable models.`,
        },
        {
          heading: "09 · Talent Pool",
          body: `${name} maintains a roster of over ${v.workersCount || "70"} pre-screened worker profiles. Each has undergone preliminary checks covering documentation readiness, skill sets and basic language capability.\n\nIndustries: ${v.industries || "Construction, Manufacturing, Service"}.\nDistribution: Construction 45% · Manufacturing 30% · Service 15% · Others 10%.\nReadiness: Passport active · Documents verified · Basic English · Trainable skills.`,
        },
        {
          heading: "10 · Compliance, Roadmap & Contact",
          body: `Compliance & Ethics: no unrealistic timeline projections · adherence to cross-border mandates · no false guarantees on approvals · full privacy & credentials safety.\n\nDisclaimer: Final visa approval remains strictly with the immigration ministries of destination countries.\n\nFuture Roadmap: Digital Client Dashboard · AI-Assisted Workflow Integration · Scaling deployments across 15+ target nations by 2028.\n\nContact:\nWebsite: ${v.website || "visahobe.com"}\nEmail: ${v.email || "contact@visahobe.com"}\nPhone: ${v.phone || "+1 (323) 601-8257"}\nReference: ${v.docRef || "VHB-CP-2026"}\n\n© ${new Date().getFullYear()} ${name} · All rights reserved.`,
        },
      ],
    };
  },
};

// ------------- Employment Work Permit (10-page) -------------
const employment: BuilderConfig = {
  type: "employment",
  title: "Employment / Work Permit",
  description: "10-page work permit package, country-aware",
  gradient: "ocean",
  fields: [
    // Employer (prefilled with VisaHOBe partner-style data)
    { key: "employer", label: "Employer / Company", required: true, placeholder: "Labourpower Recruitment Services Pty Ltd" },
    { key: "employerAddress", label: "Employer Address", type: "textarea", placeholder: "Level 8, 100 William Street, Sydney NSW 2011" },
    { key: "employerAbn", label: "Employer Reg / ABN / UEN", placeholder: "ABN 12 345 678 901" },
    { key: "employerContact", label: "Employer Contact / HR", placeholder: "HR Department · hr@employer.com" },
    // Worker
    { key: "employee", label: "Employee Full Name", required: true, placeholder: "MD Ashraf Ali" },
    { key: "passportNo", label: "Passport Number", required: true },
    { key: "passportExpiry", label: "Passport Expiry", type: "date" },
    { key: "dob", label: "Date of Birth", type: "date" },
    { key: "nationality", label: "Nationality", placeholder: "Bangladeshi" },
    { key: "address", label: "Home Address", type: "textarea" },
    // Job
    { key: "position", label: "Position / Occupation", required: true, placeholder: "Construction Labourer" },
    { key: "anzscoCode", label: "Occupation Code (ANZSCO / SOC / SSOC)", placeholder: "821111" },
    { key: "workSite", label: "Work Site / Location", placeholder: "Various NSW project sites" },
    { key: "startDate", label: "Commencement Date", type: "date", required: true },
    { key: "permitNo", label: "Work Permit / Visa No.", placeholder: "AUS5496524" },
    { key: "permitValidity", label: "Permit Valid Until", type: "date" },
    { key: "weeklyHours", label: "Weekly Hours", type: "number", placeholder: "38" },
    { key: "hourlyRate", label: "Hourly Rate", type: "number", placeholder: "32" },
    // Sponsor
    { key: "sponsor", label: "Recruiting / Sponsor Partner", placeholder: "VisaHOBe PTE. LTD." },
    { key: "sponsorRef", label: "Sponsor Reference No.", placeholder: "VHB-WP-2026-001" },
  ],
  extraByCountry: {
    AU: [{ key: "subclass", label: "Visa Subclass", placeholder: "482 / 494 / 400" }],
    AE: [{ key: "molNumber", label: "MOHRE / Labour Card No." }],
    SA: [{ key: "iqama", label: "Iqama Number" }],
    SG: [{ key: "fin", label: "FIN Number" }],
    GB: [{ key: "cos", label: "Certificate of Sponsorship (CoS)" }],
  },
  build: (v, c) => {
    const country = COUNTRIES.find((x) => x.code === c)!;
    const law = countryClause(
      c,
      {
        AU: "the Fair Work Act 2009 (Cth) and the Migration Act 1958 (Cth)",
        AE: "UAE Federal Decree-Law No. 33 of 2021 and MOHRE regulations",
        SA: "the Saudi Labor Law and Ministry of HRSD regulations",
        SG: "the Employment Act and Employment of Foreign Manpower Act of Singapore",
        GB: "the UK Immigration Rules and Worker / Skilled Worker route",
        US: "the Immigration and Nationality Act and applicable DOL regulations",
      },
      "applicable labour and immigration laws"
    );
    const authority = countryClause(
      c,
      {
        AU: "Department of Home Affairs, Australia",
        AE: "MOHRE / ICP — UAE",
        SA: "Ministry of Human Resources and Social Development, KSA",
        SG: "Ministry of Manpower, Singapore",
        GB: "UK Visas and Immigration (UKVI)",
        US: "USCIS — Department of Homeland Security",
      },
      `${country.name} immigration & labour authority`
    );
    const employer = v.employer || "Employer";
    const employee = v.employee || "Employee";
    const sponsor = v.sponsor || "VisaHOBe PTE. LTD.";
    const rate = Number(v.hourlyRate || 0);
    const hours = Number(v.weeklyHours || 0);
    const weekly = (rate * hours).toLocaleString();

    return {
      title: `Work Permit & Employment Package — ${employee}`,
      subtitle: `${v.position || "Position"} · ${employer} · ${country.flag} ${country.name}`,
      author: sponsor,
      client: employee,
      sections: [
        {
          heading: "01 · Cover & Reference",
          body: `Document: Work Permit & Employment Package\nWorker: ${employee}\nEmployer: ${employer}\nDestination: ${country.flag} ${country.name}\nPermit / Visa No.: ${v.permitNo || "—"}\nValid Until: ${v.permitValidity || "—"}\nSponsor: ${sponsor}\nSponsor Reference: ${v.sponsorRef || "—"}\nIssued: ${new Date().toLocaleDateString()}`,
        },
        {
          heading: "02 · Employer Details",
          body: `Company: ${employer}\nRegistration: ${v.employerAbn || "—"}\nRegistered Address:\n${v.employerAddress || "—"}\nContact: ${v.employerContact || "—"}\nJurisdiction: ${country.name}\nGoverning Law: ${law}.`,
        },
        {
          heading: "03 · Worker Particulars",
          body: `Full Name: ${employee}\nDate of Birth: ${v.dob || "—"}\nNationality: ${v.nationality || "—"}\nPassport No.: ${v.passportNo || "—"}\nPassport Expiry: ${v.passportExpiry || "—"}\nHome Address:\n${v.address || "—"}`,
        },
        {
          heading: "04 · Position & Duties",
          body: `Position: ${v.position || "—"}\nOccupation Code: ${v.anzscoCode || "—"}\nWork Site / Location: ${v.workSite || "—"}\nReporting: Site Supervisor / Project Manager\n\nThe Employee shall perform all duties associated with the position, comply with site safety, attend induction and follow all reasonable directions issued by the Employer.`,
        },
        {
          heading: "05 · Commencement & Permit",
          body: `Commencement Date: ${v.startDate || "—"}\nWork Permit / Visa Number: ${v.permitNo || "—"}\nValid Until: ${v.permitValidity || "—"}\nIssuing Authority: ${authority}.\n\nEmployment is conditional on continuous validity of the above permit. The Employee shall not undertake work outside the conditions of this permit.`,
        },
        {
          heading: "06 · Hours, Pay & Allowances",
          body: `Standard Weekly Hours: ${hours || "—"}\nHourly Rate: ${country.currency} ${rate || "—"}\nEstimated Weekly Gross: ${country.currency} ${weekly}\nPayment Cycle: Weekly via direct bank transfer.\nOvertime: Paid in accordance with ${law}.\nDeductions: Statutory taxes, superannuation / social contributions as applicable.`,
        },
        {
          heading: "07 · Leave, Insurance & Welfare",
          body: `Annual Leave: As prescribed by ${country.name} law.\nPublic Holidays: As per official calendar.\nSick Leave: Statutory entitlement.\nInsurance: Workers' compensation / medical cover arranged by the Employer.\nAccommodation: As separately agreed in the placement letter.\nRepatriation: Per sponsor agreement with ${sponsor}.`,
        },
        {
          heading: "08 · Conduct, Confidentiality & Termination",
          body: `The Employee shall observe all workplace policies, code of conduct, anti-harassment, drug & alcohol, and confidentiality obligations.\n\nTermination: Either party may terminate by written notice in accordance with ${law}. Summary termination is permitted for serious misconduct, breach of visa conditions, or unauthorised absence.`,
        },
        {
          heading: "09 · Sponsor Acknowledgement",
          body: `This placement is coordinated by ${sponsor} as the recruiting / mobility partner. The Sponsor confirms that the Employee has been screened for documentation readiness, skill suitability and basic communication ability prior to deployment.\n\nSponsor Reference: ${v.sponsorRef || "—"}\nSponsor Contact: contact@visahobe.com  ·  +1 (323) 601-8257`,
        },
        {
          heading: "10 · Declaration & Signatures",
          body: `The parties acknowledge that they have read, understood and agreed to the terms set out in this Work Permit & Employment Package, governed by ${law}.\n\nFor and on behalf of ${employer}\nName: _______________________\nSignature: _______________________   Date: ____________\n\nEmployee (${employee})\nSignature: _______________________   Date: ____________\n\nFor Sponsor (${sponsor})\nSignature: _______________________   Date: ____________`,
        },
      ],
    };
  },
};

export const BUILDERS: Record<BuilderType, BuilderConfig> = {
  contract,
  offer,
  passport,
  visa,
  workorder,
  acknowledgement,
  company,
  employment,
};

export function applyBuilder(type: BuilderType, values: Record<string, string>, country: string) {
  const cfg = BUILDERS[type];
  const patch = cfg.build(values, country);
  const cur = getDoc();
  setDoc({
    ...patch,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    brand: cur.brand,
    options: cur.options,
  } as Partial<DocData>);
}
