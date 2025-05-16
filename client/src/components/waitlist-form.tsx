import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitlistValidationSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { trackWaitlistSignup } from "@/lib/analytics";

export function WaitlistForm() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(waitlistValidationSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { fullName: string; email: string }) => {
      const response = await apiRequest("POST", "/api/waitlist/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setFormState("success");
        reset();
        // Track successful sign up
        trackWaitlistSignup(data.data);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
        setFormState("error");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setFormState("error");
    },
  });

  const onSubmit = (data: { fullName: string; email: string }) => {
    mutation.mutate(data);
  };

  const resetForm = () => {
    setFormState("idle");
    reset();
  };

  return (
    <section id="waitlist" className="py-20 bg-primary-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Join Our Waitlist</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Be the first to know when we launch and get exclusive early access.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full shadow-lg">
            <CardContent className="p-8">
              {formState === "idle" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-300" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-300" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white hover:bg-primary-600"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                </form>
              )}
              
              {/* Success Message */}
              {formState === "success" && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-secondary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                  <p className="text-muted-foreground">
                    Thanks for joining our waitlist. We'll notify you as soon as we launch. 
                    In the meantime, check your email for a confirmation.
                  </p>
                </div>
              )}
              
              {/* Error Message */}
              {formState === "error" && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground">
                    We couldn't process your submission. Please try again or contact support if the problem persists.
                  </p>
                  <Button 
                    onClick={resetForm} 
                    className="mt-4 bg-primary text-white hover:bg-primary-600"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By joining our waitlist, you agree to our 
              <a href="#" className="text-primary hover:text-primary-700 mx-1">Terms of Service</a> and 
              <a href="#" className="text-primary hover:text-primary-700 mx-1">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
