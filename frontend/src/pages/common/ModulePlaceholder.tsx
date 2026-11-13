import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldAlert } from "lucide-react";

interface ModulePlaceholderProps {
  moduleName: string;
  description: string;
  scheduledPhase: string;
  features: string[];
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  moduleName,
  description,
  scheduledPhase,
  features,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{moduleName}</h1>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <Badge variant="info" className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Scheduled: {scheduledPhase}
        </Badge>
      </div>

      <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">
                Architecture Bounded Context Prepared
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                This business module will be implemented according to the modular monolith roadmap.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600 font-medium">Planned Specifications & Capabilities:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 bg-white rounded-md border border-slate-200 text-xs font-medium text-slate-700 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

