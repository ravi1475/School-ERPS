export interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    designation: string;
    subjects: string[];
    classes: string;
    sections: {
      class: string;
      sections: string[];
    }[];
    joinDate: string;
    address: string;
    education: string;
    experience: string;
    profileImage: string;
    isClassIncharge: boolean;
    inchargeClass?: string;
    inchargeSection?: string;
  }