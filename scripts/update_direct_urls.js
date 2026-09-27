const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../apps/web/src/lib/syllabusData.js');
let code = fs.readFileSync(filePath, 'utf8');

// Update MPSC paper & answer key links to direct candidate information portal
code = code.replaceAll(
  'paperUrl: "https://mpsc.gov.in", answerKeyUrl: "https://mpsconline.gov.in"',
  'paperUrl: "https://mpsc.gov.in/candidate_information", answerKeyUrl: "https://mpsconline.gov.in/candidate"'
);

// Update Mahapolice
code = code.replaceAll(
  'paperUrl: "https://mahapolice.gov.in", answerKeyUrl: "https://mahapolice.gov.in"',
  'paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm"'
);
code = code.replaceAll(
  'officialWebsite: "https://mahapolice.gov.in"',
  'officialWebsite: "https://mahapolice.gov.in/citizen/recruitment.htm"'
);
code = code.replaceAll(
  'notificationUrl: "https://mahapolice.gov.in"',
  'notificationUrl: "https://policerecruitment2024.mahait.org"'
);

// Update Talathi (Mahabhumi)
code = code.replaceAll(
  'paperUrl: "https://mahabhumi.gov.in", answerKeyUrl: "https://mahabhumi.gov.in"',
  'paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action"'
);
code = code.replaceAll(
  'officialWebsite: "https://mahabhumi.gov.in"',
  'officialWebsite: "https://mahabhumi.gov.in/mahabhumihome"'
);
code = code.replaceAll(
  'notificationUrl: "https://mahabhumi.gov.in"',
  'notificationUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action"'
);

// Update ZP (RDD)
code = code.replaceAll(
  'paperUrl: "https://rdd.maharashtra.gov.in", answerKeyUrl: "https://rdd.maharashtra.gov.in"',
  'paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment"'
);
code = code.replaceAll(
  'officialWebsite: "https://rdd.maharashtra.gov.in"',
  'officialWebsite: "https://rdd.maharashtra.gov.in/en/recruitment"'
);
code = code.replaceAll(
  'notificationUrl: "https://rdd.maharashtra.gov.in"',
  'notificationUrl: "https://rdd.maharashtra.gov.in/en/recruitment"'
);

// Update Mahaforest
code = code.replaceAll(
  'paperUrl: "https://mahaforest.gov.in", answerKeyUrl: "https://mahaforest.gov.in"',
  'paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php"'
);
code = code.replaceAll(
  'officialWebsite: "https://mahaforest.gov.in"',
  'officialWebsite: "https://mahaforest.gov.in/recruitment.php"'
);
code = code.replaceAll(
  'notificationUrl: "https://mahaforest.gov.in"',
  'notificationUrl: "https://mahaforest.gov.in/recruitment.php"'
);

// Update RRB
code = code.replaceAll(
  'paperUrl: "https://rrbcdg.gov.in", answerKeyUrl: "https://rrbcdg.gov.in"',
  'paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php"'
);
code = code.replaceAll(
  'officialWebsite: "https://rrbcdg.gov.in"',
  'officialWebsite: "https://www.rrbcdg.gov.in/notice_boards.php"'
);
code = code.replaceAll(
  'notificationUrl: "https://rrbcdg.gov.in"',
  'notificationUrl: "https://www.rrbapply.gov.in"'
);

// Update IBPS
code = code.replaceAll(
  'paperUrl: "https://ibps.in", answerKeyUrl: "https://ibps.in"',
  'paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/"'
);
code = code.replaceAll(
  'officialWebsite: "https://ibps.in"',
  'officialWebsite: "https://www.ibps.in/crp-po-mt/"'
);
code = code.replaceAll(
  'notificationUrl: "https://ibps.in"',
  'notificationUrl: "https://ibpsonline.ibps.in"'
);

// Update SBI
code = code.replaceAll(
  'paperUrl: "https://bank.sbi/careers", answerKeyUrl: "https://bank.sbi/careers"',
  'paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings"'
);
code = code.replaceAll(
  'officialWebsite: "https://sbi.co.in/web/careers"',
  'officialWebsite: "https://sbi.co.in/web/careers/current-openings"'
);
code = code.replaceAll(
  'notificationUrl: "https://bank.sbi/careers"',
  'notificationUrl: "https://sbi.co.in/web/careers/current-openings"'
);

// Update MPSC notificationUrl
code = code.replaceAll(
  'notificationUrl: "https://mpsconline.gov.in"',
  'notificationUrl: "https://mpsconline.gov.in/candidate"'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated syllabusData.js with direct URLs for all exams!');
