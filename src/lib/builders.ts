// Country-aware document builders for HR / immigration / operations docs.
import { DocData, DocSection, setDoc, getDoc } from "./docStore";

export type BuilderType =
  | "contract"
  | "offer"
  | "passport"
  | "visa"
  | "workorder"
  | "acknowledgement";

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

export const BUILDERS: Record<BuilderType, BuilderConfig> = {
  contract,
  offer,
  passport,
  visa,
  workorder,
  acknowledgement,
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
