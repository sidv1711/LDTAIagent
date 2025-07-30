"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Check, X, AlertTriangle, RefreshCw, Activity, Brain, Shield, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// TypeScript interfaces for API responses
interface ServiceHealth {
  status: "operational" | "degraded" | "down" | "maintenance";
  responseTime: number;
  lastCheck: string;
  uptime: number;
  version: string;
}

interface KnowledgeBaseSync {
  lastSync: string;
  nextSync: string;
  syncStatus: "synced" | "syncing" | "failed";
  documentsUpdated: number;
  syncError?: string;
}

interface ComplianceAnalysis {
  complianceScore: number;
  lastAnalysis: string;
  policyUpdates: number;
  criticalViolations: { rule: string; count: number }[];
  warningAlerts: number;
}

interface SystemStatus {
  apiHealth: ServiceHealth;
  knowledgeBaseSync: KnowledgeBaseSync;
  complianceAnalysis: ComplianceAnalysis;
}

// Simulation functions
const generateRandomResponseTime = (): number => {
  return Math.floor(Math.random() * 500) + 50;
};

const generateUptime = (): number => {
  return Math.round((Math.random() * 5 + 95) * 100) / 100;
};

const generateHealthStatus = (): "operational" | "degraded" | "down" | "maintenance" => {
  const rand = Math.random();
  if (rand < 0.85) return "operational";
  if (rand < 0.95) return "degraded";
  if (rand < 0.98) return "maintenance";
  return "down";
};

const simulateApiHealth = (): ServiceHealth => {
  const status = generateHealthStatus();
  return {
    status,
    responseTime: generateRandomResponseTime(),
    lastCheck: new Date().toISOString(),
    uptime: generateUptime(),
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`
  };
};

const simulateKnowledgeBaseSync = (): KnowledgeBaseSync => {
  const statuses: Array<"synced" | "syncing" | "failed"> = ["synced", "syncing", "failed"];
  const syncStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const lastSync = new Date(Date.now() - Math.random() * 3600000).toISOString();
  const nextSync = new Date(Date.now() + (Math.random() * 3600000)).toISOString();
  
  return {
    lastSync,
    nextSync,
    syncStatus,
    documentsUpdated: Math.floor(Math.random() * 50) + 1,
    syncError: syncStatus === "failed" ? "Database connection timeout" : undefined
  };
};

const simulateComplianceAnalysis = (): ComplianceAnalysis => {
  const complianceScore = Math.round((Math.random() * 30 + 70) * 10) / 10;
  const criticalRules = ["GDPR_DATA_RETENTION", "SOX_AUDIT_TRAIL", "HIPAA_ENCRYPTION"];
  
  return {
    complianceScore,
    lastAnalysis: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    policyUpdates: Math.floor(Math.random() * 5) + 1,
    criticalViolations: criticalRules.slice(0, Math.floor(Math.random() * 3) + 1).map(rule => ({
      rule,
      count: Math.floor(Math.random() * 10) + 1
    })),
    warningAlerts: Math.floor(Math.random() * 20) + 1
  };
};

const simulateSystemStatus = (): SystemStatus => ({
  apiHealth: simulateApiHealth(),
  knowledgeBaseSync: simulateKnowledgeBaseSync(),
  complianceAnalysis: simulateComplianceAnalysis()
});

// Helper function to format dates
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
    case "synced":
      return <Check className="w-4 h-4 text-green-500" />;
    case "degraded":
    case "failed":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "down":
    case "maintenance":
      return <X className="w-4 h-4 text-red-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "operational":
    case "synced":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "degraded":
    case "syncing":
    case "failed":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "down":
    case "maintenance":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function ApiStatusService() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshStatus = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSystemStatus(simulateSystemStatus());
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const healthMetrics = [
    {
      title: "API Health",
      icon: Activity,
      data: systemStatus?.apiHealth,
      description: "REST API endpoints"
    },
    {
      title: "Knowledge Base",
      icon: Brain,
      data: systemStatus?.knowledgeBaseSync,
      description: "Document synchronization"
    },
    {
      title: "Compliance",
      icon: Shield,
      data: systemStatus?.complianceAnalysis,
      description: "Regulatory compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                System Status Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring of all backend services
              </p>
            </div>
            <Button
              onClick={refreshStatus}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Service Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border">
                  <CardHeader>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48 mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-24 mt-4" />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <metric.icon className="w-5 h-5 text-primary" />
                        {metric.title}
                      </CardTitle>
                      <CardDescription>{metric.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {metric.title === "API Health" && systemStatus?.apiHealth && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(systemStatus.apiHealth.status)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(systemStatus.apiHealth.status)}
                                {systemStatus.apiHealth.status}
                              </div>
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {systemStatus.apiHealth.responseTime}ms
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Uptime</span>
                              <span className="font-medium">{systemStatus.apiHealth.uptime}%</span>
                            </div>
                            <Progress 
                              value={systemStatus.apiHealth.uptime} 
                              className="h-2 bg-muted" 
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            v{systemStatus.apiHealth.version}
                          </div>
                        </div>
                      )}

                      {metric.title === "Knowledge Base" && systemStatus?.knowledgeBaseSync && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(systemStatus.knowledgeBaseSync.syncStatus)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(systemStatus.knowledgeBaseSync.syncStatus)}
                                {systemStatus.knowledgeBaseSync.syncStatus}
                              </div>
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {systemStatus.knowledgeBaseSync.documentsUpdated} docs
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last sync: </span>
                              <span className="font-medium">
                                {formatRelativeTime(systemStatus.knowledgeBaseSync.lastSync)}
                              </span>
                            </div>
                            {systemStatus.knowledgeBaseSync.syncError && (
                              <div className="text-xs text-red-500">
                                {systemStatus.knowledgeBaseSync.syncError}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {metric.title === "Compliance" && systemStatus?.complianceAnalysis && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-1">
                              {systemStatus.complianceAnalysis.complianceScore}%
                            </div>
                            <Progress 
                              value={systemStatus.complianceAnalysis.complianceScore} 
                              className="h-2 bg-muted" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Policy updates</span>
                              <div className="font-medium">{systemStatus.complianceAnalysis.policyUpdates}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Warnings</span>
                              <div className="font-medium">{systemStatus.complianceAnalysis.warningAlerts}</div>
                            </div>
                          </div>
                          {systemStatus.complianceAnalysis.criticalViolations.length > 0 && (
                            <div className="text-xs">
                              <div className="text-red-500 mb-1">
                                {systemStatus.complianceAnalysis.criticalViolations[0].rule}
                              </div>
                              <div className="text-muted-foreground">
                                +{systemStatus.complianceAnalysis.criticalViolations.length - 1} more violations
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {systemStatus && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Detailed Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStatus.apiHealth && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">API Endpoints</h3>
                    <Separator className="mb-3" />
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">
                          {systemStatus.apiHealth.status.charAt(0).toUpperCase() + systemStatus.apiHealth.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium">{systemStatus.apiHealth.responseTime}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium">{systemStatus.apiHealth.uptime}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Check</span>
                        <span className="font-medium">{formatRelativeTime(systemStatus.apiHealth.lastCheck)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}