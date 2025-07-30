"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Upload, FileText, AlertCircle, CheckCircle2, XCircle, FileSearch, ShieldCheck, Calendar, User, Clock, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Zap, Shield, Check, X, Download, RefreshCw, Eye, EyeOff, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AnalysisDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ComplianceSection {
  id: string;
  title: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
  score: number;
  maxScore: number;
  findings: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  evidenceCount: number;
}

interface GapAnalysis {
  totalSections: number;
  compliantSections: number;
  partialCompliance: number;
  nonCompliantSections: number;
  criticalGaps: number;
  highRiskAreas: number;
  mediumRiskAreas: number;
  lowRiskAreas: number;
}

interface RiskAssessment {
  overallScore: number;
  maxScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categoryScores: {
    [key: string]: {
      score: number;
      maxScore: number;
      riskLevel: string;
    };
  };
  topRisks: Array<{
    id: string;
    description: string;
    impact: number;
    likelihood: number;
    riskScore: number;
    category: string;
  }>;
}

interface FDARegulations {
  21CFRPart11: ComplianceSection;
  21CFRPart58: ComplianceSection;
  21CFRPart210: ComplianceSection;
  21CFRPart211: ComplianceSection;
  21CFRPart820: ComplianceSection;
  21CFRPart803: ComplianceSection;
}

interface AnalysisResult {
  id: string;
  documentId: string;
  status: 'completed' | 'failed' | 'processing';
  completeness: {
    documentsReviewed: number;
    totalDocuments: number;
    completenessPercentage: number;
  };
  gapAnalysis: GapAnalysis;
  riskAssessment: RiskAssessment;
  regulations: FDARegulations;
  timestamp: Date;
  estimatedRemediationTime: string;
}

interface RemediationAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedEffort: string;
  complexity: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

const FDAComplianceAnalyzer = () => {
  const [documents, setDocuments] = useState<AnalysisDocument[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AnalysisDocument | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockDocuments: AnalysisDocument[] = [
    {
      id: '1',
      name: 'FDA_New_Drug_Application_2024.pdf',
      type: 'application/pdf',
      size: 2847233,
      uploadDate: new Date(),
      status: 'completed'
    },
    {
      id: '2',
      name: 'Clinical_Trial_Database_Archive.zip',
      type: 'application/zip',
      size: 15428921,
      uploadDate: new Date(),
      status: 'completed'
    },
    {
      id: '3',
      name: 'Stability_Study_Reports.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1234533,
      uploadDate: new Date(),
      status: 'completed'
    },
    {
      id: '4',
      name: 'SOP_Manufacturing_Process_v3.2.pdf',
      type: 'application/pdf',
      size: 987654,
      uploadDate: new Date(),
      status: 'completed'
    },
    {
      id: '5',
      name: 'Quality_Agreement_Third_Party_Manufacturer.pdf',
      type: 'application/pdf',
      size: 2123456,
      uploadDate: new Date(),
      status: 'completed'
    }
  ];

  const mockAnalysisResult: AnalysisResult = {
    id: 'analysis-001',
    documentId: 'all',
    status: 'completed',
    completeness: {
      documentsReviewed: 5,
      totalDocuments: 5,
      completenessPercentage: 100
    },
    gapAnalysis: {
      totalSections: 42,
      compliantSections: 28,
      partialCompliance: 8,
      nonCompliantSections: 6,
      criticalGaps: 3,
      highRiskAreas: 7,
      mediumRiskAreas: 15,
      lowRiskAreas: 17
    },
    riskAssessment: {
      overallScore: 74,
      maxScore: 100,
      riskLevel: 'medium',
      categoryScores: {
        '21CFRPart11': { score: 91, maxScore: 100, riskLevel: 'low' },
        '21CFRPart58': { score: 83, maxScore: 100, riskLevel: 'low' },
        '21CFRPart210': { score: 77, maxScore: 100, riskLevel: 'medium' },
        '21CFRPart211': { score: 69, maxScore: 100, riskLevel: 'medium' },
        '21CFRPart820': { score: 65, maxScore: 100, riskLevel: 'medium' },
        '21CFRPart803': { score: 88, maxScore: 100, riskLevel: 'low' }
      },
      topRisks: [
        {
          id: 'risk-001',
          description: 'Incomplete validation documentation for critical manufacturing processes',
          impact: 9,
          likelihood: 7,
          riskScore: 63,
          category: '21CFRPart211'
        },
        {
          id: 'risk-002',
          description: 'Missing electronic signature validation for critical systems',
          impact: 8,
          likelihood: 6,
          riskScore: 48,
          category: '21CFRPart11'
        },
        {
          id: 'risk-003',
          description: 'Inadequate change control procedures for supplier qualification',
          impact: 7,
          likelihood: 7,
          riskScore: 49,
          category: '21CFRPart820'
        }
      ]
    },
    regulations: {
      21CFRPart11: {
        id: '21CFRPart11',
        title: 'Electronic Records; Electronic Signatures',
        status: 'compliant',
        score: 91,
        maxScore: 100,
        findings: ['Electronic signature validation completed', 'Audit trail functionality verified', 'System validation documentation complete'],
        recommendations: ['Implement additional user access controls', 'Consider enhanced encryption protocols'],
        riskLevel: 'low',
        evidenceCount: 23
      },
      21CFRPart58: {
        id: '21CFRPart58',
        title: 'Good Laboratory Practice for Nonclinical Laboratory Studies',
        status: 'compliant',
        score: 83,
        maxScore: 100,
        findings: ['GLP compliance documentation complete', 'Quality system procedures established', 'Training records current'],
        recommendations: ['Update SOPs to reflect recent regulatory changes', 'Consider quarterly compliance reviews'],
        riskLevel: 'low',
        evidenceCount: 18
      },
      21CFRPart210: {
        id: '21CFRPart210',
        title: 'Current Good Manufacturing Practice in Manufacturing, Processing, Packing, or Holding...',
        status: 'partial',
        score: 77,
        maxScore: 100,
        findings: ['Basic cGMP procedures established', 'Some documentation gaps in batch records', 'Training programs need enhancement'],
        recommendations: ['Implement enhanced batch record review process', 'Develop comprehensive training matrix', 'Consider additional cleaning validation studies'],
        riskLevel: 'medium',
        evidenceCount: 31
      },
      21CFRPart211: {
        id: '21CFRPart211',
        title: 'Current Good Manufacturing Practice for Finished Pharmaceuticals',
        status: 'partial',
        score: 69,
        maxScore: 100,
        findings: ['Missing validation data for critical processes', 'Inadequate change control documentation', 'Some equipment qualification records incomplete'],
        recommendations: ['Complete process validation studies for critical manufacturing steps', 'Revise change control procedures', 'Re-qualify critical equipment'],
        riskLevel: 'medium',
        evidenceCount: 42
      },
      21CFRPart820: {
        id: '21CFRPart820',
        title: 'Quality System Regulation',
        status: 'non-compliant',
        score: 65,
        maxScore: 100,
        findings: ['Supplier qualification procedures inadequate', 'CAPA system deficiencies identified', 'Management review processes ineffective'],
        recommendations: ['Implement comprehensive supplier audit program', 'Revise CAPA procedures and training', 'Establish effective management review cycles'],
        riskLevel: 'high',
        evidenceCount: 28
      },
      21CFRPart803: {
        id: '21CFRPart803',
        title: 'Medical Device Reporting',
        status: 'compliant',
        score: 88,
        maxScore: 100,
        findings: ['MDR procedures established', 'Training documentation complete', 'Complaint handling system functional'],
        recommendations: ['Consider annual MDR training refresh', 'Implement trending analysis for complaints'],
        riskLevel: 'low',
        evidenceCount: 15
      }
    },
    timestamp: new Date(),
    estimatedRemediationTime: '3-4 months'
  };

  const remediationActions: RemediationAction[] = [
    {
      id: 'action-001',
      title: 'Complete process validation for sterilization procedures',
      description: 'Implement comprehensive validation protocol for terminal sterilization process including heat distribution studies and biological indicator validation.',
      priority: 'critical',
      estimatedEffort: '4-6 weeks',
      complexity: 'high',
      status: 'pending'
    },
    {
      id: 'action-002',
      title: 'Implement supplier qualification program',
      description: 'Establish systematic supplier qualification including on-site audits, quality agreements, and ongoing monitoring procedures.',
      priority: 'critical',
      estimatedEffort: '3-4 weeks',
      complexity: 'medium',
      status: 'pending'
    },
    {
      id: 'action-003',
      title: 'Update change control procedures',
      description: 'Revise current change control SOP to include impact assessment matrix and risk-based evaluation criteria.',
      priority: 'high',
      estimatedEffort: '2-3 weeks',
      complexity: 'medium',
      status: 'pending'
    },
    {
      id: 'action-004',
      title: 'Enhance CAPA system procedures',
      description: 'Develop enhanced CAPA procedures including effectiveness checks and trending analysis capabilities.',
      priority: 'high',
      estimatedEffort: '2-3 weeks',
      complexity: 'medium',
      status: 'pending'
    },
    {
      id: 'action-005',
      title: 'Implement additional user access controls',
      description: 'Add role-based access control enhancements to electronic signature systems including dual-factor authentication.',
      priority: 'medium',
      estimatedEffort: '1-2 weeks',
      complexity: 'low',
      status: 'pending'
    }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
    setAnalysisResults([mockAnalysisResult]);
  }, []);

  const simulateDocumentProcessing = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentAnalysis(mockAnalysisResult);
    setShowResults(true);
    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete",
      description: "FDA compliance analysis has been completed successfully.",
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'partial':
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const calculateProgress = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100);
  };

  const FileUploadSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            Upload Documentation
          </CardTitle>
          <CardDescription>Upload regulatory documents for FDA compliance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const newDocs = Array.from(e.target.files).map(file => ({
                    id: `doc-${Date.now()}-${Math.random()}`,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    uploadDate: new Date(),
                    status: 'pending' as const
                  }));
                  setDocuments(prev => [...prev, ...newDocs]);
                  toast({
                    title: "Files Uploaded",
                    description: `${newDocs.length} document(s) uploaded successfully.`,
                  });
                }
              }}
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-gray-400">PDF, DOCX, XLSX up to 50MB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>{documents.length} document(s) ready for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(doc.size / 1024 / 1024).toFixed(1)} MB • {doc.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(doc.status)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Button 
        onClick={simulateDocumentProcessing}
        disabled={isAnalyzing || documents.length === 0}
        className="w-full"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Compliance...
          </>
        ) : (
          <>
            <FileSearch className="w-4 h-4 mr-2" />
            Start Analysis
          </>
        )}
      </Button>
    </motion.div>
  );

  const AnalysisResultsSection = () => {
    if (!currentAnalysis) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Analysis Summary
            </CardTitle>
            <CardDescription>High-level compliance status and risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {currentAnalysis.gapAnalysis.compliantSections}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compliant Sections</p>
                <Progress value={calculateProgress(currentAnalysis.gapAnalysis.compliantSections, currentAnalysis.gapAnalysis.totalSections)} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {currentAnalysis.gapAnalysis.nonCompliantSections}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Non-Compliant</p>
                <Progress value={calculateProgress(currentAnalysis.gapAnalysis.nonCompliantSections, currentAnalysis.gapAnalysis.totalSections)} className="mt-2" />
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${currentAnalysis.riskAssessment.riskLevel === 'low' ? 'text-green-400' : 
                  currentAnalysis.riskAssessment.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {currentAnalysis.riskAssessment.overallScore}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Score</p>
                <Badge className={`mt-2 ${getRiskColor(currentAnalysis.riskAssessment.riskLevel)}`}>
                  {currentAnalysis.riskAssessment.riskLevel}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">
                  {currentAnalysis.estimatedRemediationTime}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remediation Timeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="remediation">Remediation Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gap-analysis">
            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis by Regulation</CardTitle>
                <CardDetailed>Detailed compliance status for each FDA regulation</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(currentAnalysis.regulations).map(([key, regulation]) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(regulation.status)}
                            <span className="font-medium">{regulation.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm px-2 py-1 rounded-full ${getRiskColor(regulation.riskLevel)}`}>
                              {regulation.riskLevel}
                            </span>
                            <span className="text-sm">{regulation.score}%</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-4">
                          <div>
                            <h4 className="font-semibold mb-2">Findings:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {regulation.findings.map((finding, index) => (
                                <li key={index}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {regulation.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-assessment">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Score Breakdown</CardTitle>
                  <CardDescription>Detailed risk assessment by regulation category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(currentAnalysis.riskAssessment.categoryScores).map(([category, data]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.replace('21CFRPart', '21 CFR Part ')}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getRiskColor(data.riskLevel)}`}>
                            {data.riskLevel}
                          </span>
                        </div>
                        <Progress value={data.score} className="h-2" />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {data.score}% compliant
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Risk Areas</CardTitle>
                  <CardDescription>Critical risks requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentAnalysis.riskAssessment.topRisks.map((risk) => (
                      <div key={risk.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{risk.description}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Category: {risk.category.replace('21CFRPart', '21 CFR Part ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-400">{risk.riskScore}</div>
                            <div className="text-xs text-gray-500">Risk Score</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>
                            <span className="font-medium">Impact:</span> {risk.impact}/10
                          </span>
                          <span>
                            <span className="font-medium">Likelihood:</span> {risk.likelihood}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="remediation">
            <Card>
              <CardHeader>
                <CardTitle>Remediation Action Plan</CardTitle>
                <CardDescription>Priority actions to achieve full compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {remediationActions.map((action) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${action.priority === 'critical' ? 'bg-red-500' : action.priority === 'high' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <div>
                            <h4 className="font-medium">{action.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>Priority: <span className="font-medium text-orange-400">{action.priority}</span></span>
                              <span>Effort: <span className="font-medium">{action.estimatedEffort}</span></span>
                              <span>Complexity: <span className="font-medium">{action.complexity}</span></span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Zap className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Action Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            FDA Compliance Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive regulatory compliance analysis platform providing real-time gap analysis, 
            risk assessment, and remediation guidance for FDA submissions.
          </p>
        </div>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-center">Processing Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyzing documents and generating compliance report...
                  </p>
                  <Progress value={85} className="w-full" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FileUploadSection />
          </div>
          <div className="lg:col-span-2">
            {showResults ? (
              <AnalysisResultsSection />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center space-y-4">
                  <Shield className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="text-lg text-muted-foreground">
                    Upload documents and start analysis to view compliance results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FDAComplianceAnalyzer;