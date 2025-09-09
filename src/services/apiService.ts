import axios from 'axios';

// WHO ICD-11 API base URL
const ICD_API_BASE = 'https://id.who.int/icd/release/11/2023-01/mms';

export interface ICDCode {
  code: string;
  name: string;
  category: string;
  chapter?: string;
}

export interface NAMASTECode {
  code: string;
  name: string;
  description: string;
  system: string;
}

export interface MappingSuggestion {
  icdCode: string;
  matchType: 'exact' | 'approximate' | 'partial';
  confidence: number;
}

interface ICDAPIResponse {
  destinationEntities?: Array<{
    code: string;
    title: string;
    chapter?: string;
  }>;
}

interface FHIRBundle {
  resourceType: string;
  type: string;
  entry?: Array<{
    resource?: {
      code?: {
        coding?: Array<{
          system?: string;
        }>;
      };
    };
  }>;
}

interface UploadResult {
  success: boolean;
  id: string;
}

class ApiService {
  private icdCache: Map<string, ICDCode[]> = new Map();
  private namasteCache: NAMASTECode[] = [];

  // Fetch ICD-11 codes from WHO API
  async fetchICDCodes(query?: string): Promise<ICDCode[]> {
    try {
      // For TM2 (Traditional Medicine Module 2)
      const tm2Url = `${ICD_API_BASE}/search?q=${query || ''}&chapter=26&useFlexisearch=true`;

      // For Biomedicine codes
      const biomedUrl = `${ICD_API_BASE}/search?q=${query || ''}&chapter=01-25&useFlexisearch=true`;

      const [tm2Response, biomedResponse] = await Promise.all([
        axios.get(tm2Url),
        axios.get(biomedUrl)
      ]);

      const tm2Codes = this.parseICDResponse(tm2Response.data, 'TM2');
      const biomedCodes = this.parseICDResponse(biomedResponse.data, 'Biomedicine');

      return [...tm2Codes, ...biomedCodes];
    } catch (error) {
      console.error('Error fetching ICD codes:', error);
      // Fallback to cached or sample data
      return this.getFallbackICDCodes();
    }
  }

  // Fetch NAMASTE codes
  async fetchNAMASTECodes(query?: string): Promise<NAMASTECode[]> {
    try {
      // For now, using a mock endpoint. In production, this would be:
      // const response = await axios.get(`${NAMASTE_API_BASE}/codes?query=${query}`);
      // return this.parseNAMASTEResponse(response.data);

      // Mock implementation - in real scenario, this would call actual NAMASTE API
      if (this.namasteCache.length === 0) {
        this.namasteCache = await this.loadNAMASTEFromMock();
      }

      if (!query) return this.namasteCache;

      const lowerQuery = query.toLowerCase();
      return this.namasteCache.filter(code =>
        code.code.toLowerCase().includes(lowerQuery) ||
        code.name.toLowerCase().includes(lowerQuery) ||
        code.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error fetching NAMASTE codes:', error);
      return this.getFallbackNAMASTECodes();
    }
  }

  // Get mapping suggestions between NAMASTE and ICD-11
  async getMappingSuggestions(namasteCode: string): Promise<MappingSuggestion[]> {
    try {
      // This would typically call a mapping service API
      // For now, return mock suggestions based on code patterns
      return this.generateMockSuggestions(namasteCode);
    } catch (error) {
      console.error('Error getting mapping suggestions:', error);
      return [];
    }
  }

  // Parse WHO ICD-11 API response
  private parseICDResponse(data: ICDAPIResponse, category: string): ICDCode[] {
    if (!data || !data.destinationEntities) return [];

    return data.destinationEntities.map((entity) => ({
      code: entity.code,
      name: entity.title,
      category: category,
      chapter: entity.chapter
    }));
  }

  // Mock NAMASTE data loader
  private async loadNAMASTEFromMock(): Promise<NAMASTECode[]> {
    // In production, this would load from actual NAMASTE API or CSV
    return [
      {
        code: "NAM-AYU-103",
        name: "Jvara",
        description: "Fever condition in Ayurveda, characterized by elevated body temperature",
        system: "Ayurveda"
      },
      {
        code: "NAM-AYU-201",
        name: "Prameha",
        description: "Metabolic disorder similar to diabetes in Ayurveda",
        system: "Ayurveda"
      },
      {
        code: "NAM-SID-301",
        name: "Vatha Noi",
        description: "Joint pain and arthritis-like condition in Siddha medicine",
        system: "Siddha"
      },
      {
        code: "NAM-UNN-401",
        name: "Humma",
        description: "Fever in Unani medicine",
        system: "Unani"
      }
    ];
  }

  // Generate mock mapping suggestions
  private generateMockSuggestions(namasteCode: string): MappingSuggestion[] {
    const suggestions: { [key: string]: MappingSuggestion[] } = {
      "NAM-AYU-103": [
        { icdCode: "1D44", matchType: "exact", confidence: 95 }
      ],
      "NAM-AYU-201": [
        { icdCode: "5A11", matchType: "approximate", confidence: 85 }
      ],
      "NAM-SID-301": [
        { icdCode: "FA20", matchType: "approximate", confidence: 80 }
      ]
    };

    return suggestions[namasteCode] || [];
  }

  // Fallback data in case APIs fail
  private getFallbackICDCodes(): ICDCode[] {
    return [
      {
        code: "1D44",
        name: "Fever of unknown origin",
        category: "Symptoms, signs and abnormal clinical findings"
      },
      {
        code: "5A11",
        name: "Type 2 Diabetes Mellitus",
        category: "Endocrine, nutritional and metabolic diseases"
      }
    ];
  }

  private getFallbackNAMASTECodes(): NAMASTECode[] {
    return [
      {
        code: "NAM-AYU-103",
        name: "Jvara",
        description: "Fever condition in Ayurveda",
        system: "Ayurveda"
      }
    ];
  }

  // OAuth 2.0 mock for ABHA
  async authenticateWithABHA(token: string): Promise<{ success: boolean; userId?: string }> {
    // Mock authentication - in production, validate with ABHA service
    if (token.startsWith('abha_')) {
      return { success: true, userId: token.replace('abha_', '') };
    }
    return { success: false };
  }

  // FHIR Bundle upload
  async uploadFHIRBundle(bundle: FHIRBundle): Promise<UploadResult> {
    try {
      // Mock upload - in production, send to FHIR server
      console.log('Uploading FHIR Bundle:', bundle);
      return { success: true, id: `bundle_${Date.now()}` };
    } catch (error) {
      console.error('Error uploading FHIR bundle:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
