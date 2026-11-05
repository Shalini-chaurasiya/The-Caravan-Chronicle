const getDepartmentFromComplaintType = (complaintType = "") => {
  const type = complaintType.trim().toLowerCase();

  if (/water|supply|leakage|pipeline/.test(type)) {
    return "Water Supply";
  }

  if (/road|pothole|footpath/.test(type)) {
    return "Roads & Infrastructure";
  }

  if (/electric|street light|lighting|lamp/.test(type)) {
    return "Electrical & Street Lighting";
  }

  if (/drain|sewer/.test(type)) {
    return "Drainage & Sewerage";
  }

  if (/sanitation|garbage|waste|cleanliness/.test(type)) {
    return "Sanitation";
  }

  if (/park|garden|horticulture/.test(type)) {
    return "Parks & Horticulture";
  }

  if (/traffic|signal/.test(type)) {
    return "Traffic Management";
  }

  if (/building|construction/.test(type)) {
    return "Building & Construction";
  }

  return "General Administration";
};

export default getDepartmentFromComplaintType;
