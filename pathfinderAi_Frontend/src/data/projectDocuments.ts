export interface ProjectDocuments {
  prd: string;
  hld: string;
  lld: string;
}

export const projectDocumentsMap: { [key: string]: ProjectDocuments } = {
  charitychain: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CharityChain/CharityChain_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CharityChain/CharityChain_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CharityChain/CharityChain_LLD.pdf",
  },
  cloudscale: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CloudScale/CloudScale_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CloudScale/CloudScale_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/CloudScale/CloudScale_LLD.pdf",
  },
  edulearn: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Edulearn/EduLearn%20-%20PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Edulearn/EduLearn%20_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Edulearn/EduLearn_LLD.pdf",
  },
  enerlytics: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Enerlytics/Enerlytics_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Enerlytics/Enerlytics_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/Enerlytics/Enerlytics_LLD.pdf",
  },
  farmtech: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/FarmTech/_FarmTech_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/FarmTech/FarmTech_HLD%20.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/FarmTech/FarmTech_LLD.pdf",
  },
  govconnect: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/GovConnect/GovConnect_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/GovConnect/GovConnect_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/GovConnect/GovConnect_LLD%20.pdf",
  },
  hrpro: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/HRPro/HRPro_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/HRPro/HRPro_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/HRPro/HRPro_LLD.pdf",
  },
  legalease: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/LegalEase/LegalEase_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/LegalEase/LegalEase%20-%20Legal%20Document%20Automation_%20Descriptio....pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/LegalEase/LegalEase_LLD.pdf",
  },
  mediconnect: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/MediConnect/MediConnect_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/MediConnect/MediConnect_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/MediConnect/MediConnect_LLD.pdf",
  },
  propease: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/PropEase/PropEase_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/PropEase/PropEase_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/PropEase/PropEase_LLD.pdf",
  },
  sportifyhub: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/sportify/sportifyPRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/sportify/SportifyHLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/sportify/sportifyLLD.pdf",
  },
  transittrack: {
    prd: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/TransitTrack/TransitTrack_PRD.pdf",
    hld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/TransitTrack/TransitTrack%20_HLD.pdf",
    lld: "https://storage.googleapis.com/pathfinder_projects/Projectdetails/TransitTrack/TransitTrack_LLD.pdf",
  },
};

export const getProjectDocuments = (projectSlug: string): ProjectDocuments | null => {
  if (!projectSlug) {
    return null;
  }
  return projectDocumentsMap[projectSlug.toLowerCase()] || null;
};
