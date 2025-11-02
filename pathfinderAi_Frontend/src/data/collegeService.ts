import collegesData from './colleges.json';

export interface College {
  name: string;
  location: string;
  type: string;
  ranking: number;
  rating: number;
  fees: string;
  averagePlacement: string;
  highestPlacement: string;
  placementRate: number;
  infrastructure: number;
  faculty: number;
  placements: number;
  campusLife: number;
  courses: string[];
  topRecruiters: string[];
  website: string;
  applyLink: string;
  // Computed properties for compatibility
  id?: string;
  state?: string;
  feeAmount?: number;
  placement?: {
    average: string;
    averageAmount?: number;
    highest: string;
    highestAmount?: number;
    percentage: number;
  };
  research?: number;
  alumni?: number;
  hostel?: number;
  highlights?: string[];
  image?: string;
  established?: number;
  affiliation?: string;
  accreditation?: string;
  nirf_ranking?: number;
}

export class CollegeService {
  private static rawColleges: College[] = collegesData as College[];
  private static colleges: College[] = this.processColleges();

  // Process and normalize college data
  private static processColleges(): College[] {
    return this.rawColleges.map((college, index) => ({
      ...college,
      id: college.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      state: this.extractState(college.location),
      feeAmount: this.extractFeeAmount(college.fees),
      placement: {
        average: college.averagePlacement,
        averageAmount: this.extractAmount(college.averagePlacement),
        highest: college.highestPlacement,
        highestAmount: this.extractAmount(college.highestPlacement),
        percentage: college.placementRate
      },
      research: college.placements || 4.0,
      alumni: college.faculty || 4.0,
      hostel: college.campusLife || 4.0,
      highlights: college.topRecruiters?.slice(0, 3) || [],
      image: "/placeholder.svg",
      nirf_ranking: college.ranking
    }));
  }

  // Extract state from location (this is a simplified approach)
  private static extractState(location: string): string {
    const stateMap: { [key: string]: string } = {
      'delhi': 'Delhi',
      'mumbai': 'Maharashtra',
      'bangalore': 'Karnataka',
      'chennai': 'Tamil Nadu',
      'hyderabad': 'Telangana',
      'pune': 'Maharashtra',
      'kolkata': 'West Bengal',
      'ahmedabad': 'Gujarat',
      'jaipur': 'Rajasthan',
      'lucknow': 'Uttar Pradesh',
      'bhopal': 'Madhya Pradesh',
      'chandigarh': 'Punjab',
      'thiruvananthapuram': 'Kerala',
      'bhubaneswar': 'Odisha',
      'gandhinagar': 'Gujarat',
      'raipur': 'Chhattisgarh',
      'patna': 'Bihar',
      'guwahati': 'Assam',
      'jamnagar': 'Gujarat',
      'vijayawada': 'Andhra Pradesh'
    };
    
    const locationLower = location.toLowerCase();
    for (const [city, state] of Object.entries(stateMap)) {
      if (locationLower.includes(city)) {
        return state;
      }
    }
    return location; // fallback to location itself
  }

  // Extract fee amount from fee string
  private static extractFeeAmount(fees: string): number {
    const match = fees.match(/₹([\d,]+(?:\.\d+)?)\s*(thousand|lakh|crore)/i);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2].toLowerCase();
      
      switch (unit) {
        case 'thousand':
          return amount / 100; // Convert to lakhs
        case 'lakh':
          return amount;
        case 'crore':
          return amount * 100;
        default:
          return amount;
      }
    }
    return 0;
  }

  // Extract amount from placement string
  private static extractAmount(placementStr: string): number {
    const match = placementStr.match(/₹([\d,]+(?:\.\d+)?)\s*(LPA|lakh|crore)/i);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2].toLowerCase();
      
      switch (unit) {
        case 'lpa':
        case 'lakh':
          return amount;
        case 'crore':
          return amount * 100;
        default:
          return amount;
      }
    }
    return 0;
  }

  // Get all colleges
  static getAllColleges(): Promise<College[]> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(this.colleges);
      }, 500);
    });
  }

  // Get initial limited colleges (first 8)
  static getInitialColleges(): Promise<College[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.colleges.slice(0, 8));
      }, 300);
    });
  }

  // Get colleges by filters
  static getFilteredColleges(filters: {
    location?: string;
    state?: string;
    type?: string;
    fees?: string;
    rating?: string;
    search?: string;
  }): Promise<College[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.colleges];

        // Filter by search term
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(college => 
            college.name.toLowerCase().includes(searchTerm) ||
            college.location.toLowerCase().includes(searchTerm) ||
            college.state?.toLowerCase().includes(searchTerm) ||
            college.courses.some(course => course.toLowerCase().includes(searchTerm)) ||
            college.topRecruiters.some(recruiter => recruiter.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by location
        if (filters.location) {
          filtered = filtered.filter(college => 
            college.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
            college.state?.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }

        // Filter by state
        if (filters.state) {
          filtered = filtered.filter(college => 
            college.state?.toLowerCase() === filters.state!.toLowerCase()
          );
        }

        // Filter by type
        if (filters.type) {
          filtered = filtered.filter(college => 
            college.type.toLowerCase() === filters.type!.toLowerCase()
          );
        }

        // Filter by fees
        if (filters.fees) {
          filtered = filtered.filter(college => {
            const feeValue = college.feeAmount || 0;
            switch (filters.fees) {
              case "0-2":
                return feeValue <= 2;
              case "2-5":
                return feeValue > 2 && feeValue <= 5;
              case "5-10":
                return feeValue > 5 && feeValue <= 10;
              case "10+":
                return feeValue > 10;
              default:
                return true;
            }
          });
        }

        // Filter by rating
        if (filters.rating) {
          const minRating = parseFloat(filters.rating);
          filtered = filtered.filter(college => college.rating >= minRating);
        }

        resolve(filtered);
      }, 300);
    });
  }

  // Get college by ID
  static getCollegeById(id: string): Promise<College | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const college = this.colleges.find(c => c.id === id);
        resolve(college);
      }, 100);
    });
  }

  // Get unique locations/states for filter options
  static getUniqueLocations(): string[] {
    const locations = new Set<string>();
    this.colleges.forEach(college => {
      locations.add(college.location);
      if (college.state) locations.add(college.state);
    });
    return Array.from(locations).sort();
  }

  // Get unique states for filter options
  static getUniqueStates(): string[] {
    const states = new Set<string>();
    this.colleges.forEach(college => {
      if (college.state) states.add(college.state);
    });
    return Array.from(states).sort();
  }

  // Get unique college types
  static getUniqueTypes(): string[] {
    const types = new Set<string>();
    this.colleges.forEach(college => {
      types.add(college.type);
    });
    return Array.from(types).sort();
  }
}
