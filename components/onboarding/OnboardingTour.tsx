"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, BookOpen, Terminal } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to Unicode",
    description: "Your AI-powered journey into Computer Science starts here. Let's take a quick look around.",
    icon: <Rocket className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "AI IDE",
    description: "Write code with real-time AI suggestions. Just type and let Claude/Gemini assist you.",
    icon: <Sparkles className="h-10 w-10 text-yellow-500" />,
  },
  {
    title: "Linux Sandbox",
    description: "Practice your terminal skills in our safe, simulated Linux environment.",
    icon: <Terminal className="h-10 w-10 text-green-500" />,
  },
  {
    title: "Interactive Docs",
    description: "Our documentation isn't just text—it's part of your learning experience.",
    icon: <BookOpen className="h-10 w-10 text-blue-500" />,
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const onboarded = localStorage.getItem("unicode-onboarded");
    if (!onboarded) {
      setOpen(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    localStorage.setItem("unicode-onboarded", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-center mb-6">
          {STEPS[currentStep].icon}
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {STEPS[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-base">
            {STEPS[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 mt-4">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-8 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-muted'}`} 
            />
          ))}
        </div>
        <DialogFooter className="mt-8">
          <Button onClick={nextStep} className="w-full h-12 text-lg">
            {currentStep === STEPS.length - 1 ? "Start Learning" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
