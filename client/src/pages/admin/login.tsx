import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Validation schema for admin login
const loginSchema = z.object({
  username: z.string().min(3, "Имя пользователя должно быть не менее 3 символов"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        // Store auth token in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в панель администратора",
        });
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Ошибка входа",
          description: data.message || "Неверные учетные данные",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при попытке входа. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход в панель администратора</CardTitle>
          <CardDescription className="text-center">
            Введите учетные данные для доступа к панели администратора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                {...form.register("username")}
                className={form.formState.errors.username ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-sm">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                {...form.register("password")}
                className={form.formState.errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Вернуться на <a href="/" className="text-primary hover:underline">главную страницу</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}