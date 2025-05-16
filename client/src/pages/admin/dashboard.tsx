import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Type definition for waitlist entries
type WaitlistEntry = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({
        title: "Доступ запрещен",
        description: "Пожалуйста, войдите для доступа к панели администратора",
        variant: "destructive",
      });
      navigate("/admin");
    }
  }, [navigate, toast]);

  // Fetch waitlist entries
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/admin/waitlist"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Авторизация не выполнена");

      const response = await fetch("/api/admin/waitlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      return response.json();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Авторизация не выполнена");

      const response = await fetch(`/api/admin/waitlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка удаления записи");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Запись из списка ожидания удалена",
      });
      setSelectedEntryId(null);
      // Invalidate the waitlist query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить запись: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteEntry = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Get admin user info
  const adminUser = localStorage.getItem("adminUser") 
    ? JSON.parse(localStorage.getItem("adminUser") || "{}")
    : { username: "Администратор" };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {adminUser.username}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Список участников в листе ожидания</CardTitle>
            <CardDescription>
              Просмотр и управление пользователями, зарегистрированными в листе ожидания.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Загрузка данных...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                {error instanceof Error ? error.message : "Произошла ошибка при загрузке данных"}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">Список ожидания пуст</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Полное имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((entry: WaitlistEntry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.id}</TableCell>
                        <TableCell>{entry.fullName}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${entry.email}`}
                            className="text-primary hover:underline"
                          >
                            {entry.email}
                          </a>
                        </TableCell>
                        <TableCell>{formatDate(entry.createdAt)}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setSelectedEntryId(entry.id)}
                              >
                                Удалить
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Это действие удалит запись из списка ожидания и не может быть отменено.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    if (selectedEntryId) {
                                      handleDeleteEntry(selectedEntryId);
                                    }
                                  }}
                                >
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Экспорт данных</CardTitle>
            <CardDescription>
              Выгрузка данных из списка ожидания для дальнейшего использования.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                if (data?.data) {
                  const csvContent = [
                    ["ID", "Полное имя", "Email", "Дата регистрации"],
                    ...data.data.map((entry: WaitlistEntry) => [
                      entry.id,
                      entry.fullName,
                      entry.email,
                      new Date(entry.createdAt).toLocaleString(),
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`);
                  link.style.visibility = "hidden";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              disabled={isLoading || !data?.data || data.data.length === 0}
              className="mr-2"
            >
              Экспорт в CSV
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}