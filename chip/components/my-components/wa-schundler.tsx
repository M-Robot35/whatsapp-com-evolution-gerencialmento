"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, CheckCircle, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Scheduler() {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("08:00");
  const [repeat, setRepeat] = useState("none");
  const [cronExpression, setCronExpression] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function generateCron(time: string, repeat: string) {
    if (!date) return;
    const [hours, minutes] = time.split(":");
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    let cron = `${minutes} ${hours} `;

    switch (repeat) {
      case "daily":
        cron += "* * *";
        break;
      case "weekly":
        cron += `* * ${date.getDay()}`;
        break;
      case "monthly":
        cron += `${day} * *`;
        break;
      case "yearly":
        cron += `${day} ${month} *`;
        break;
      default:
        cron += `${day} ${month} *`;
    }

    setCronExpression(cron);
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTime = event.target.value;
    setTime(newTime);
    generateCron(newTime, repeat);
  }

  function handleRepeatChange(value: string) {
    setRepeat(value);
    generateCron(time, value);
  }

  async function saveSchedule() {
    const data = {
      eventName,
      dateTime: `${format(date!, "dd/MM/yyyy")} ${time}`,
      repeat,
      cron: cronExpression,
    };

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">📅 Agendador de Tarefas</h2>

      {/* Nome do Evento */}
      <div className="mb-4">
        <Label htmlFor="event">Nome do Evento</Label>
        <Input
          id="event"
          type="text"
          placeholder="Ex: Enviar mensagem"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="border-gray-300"
        />
      </div>
      

      {/* Data Picker */}
      <div className="mb-4">
        <Label>Escolha a Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full flex items-center">
              <CalendarIcon className="mr-2" />
              {date ? format(date, "PPP") : "Escolha uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                generateCron(time, repeat);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Hora Picker */}
      <div className="mb-4">
        <Label>Escolha o Horário</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-full pl-10 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Frequência */}
      <div className="mb-4">
        <Label>Repetição</Label>
        <Select onValueChange={handleRepeatChange} value={repeat}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Apenas uma vez</SelectItem>
            <SelectItem value="daily">Todos os dias</SelectItem>
            <SelectItem value="weekly">Toda semana</SelectItem>
            <SelectItem value="monthly">Todo mês</SelectItem>
            <SelectItem value="yearly">Todo ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cron Preview */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
        <pre>Inicia em: {JSON.stringify(format(date!, "dd/MM/yyyy"))} As {time}</pre>
        📌 Expressão Cron: <span className="font-mono text-blue-600">{cronExpression || "Selecionar data e hora"}</span>
      </div>

      {/* Botão de Agendamento */}
      <Button onClick={saveSchedule} className="w-full bg-blue-500 hover:bg-blue-600">
        Agendar Tarefa
      </Button>

      {/* Feedback Visual */}
      {isSaved && (
        <div className="mt-3 p-2 bg-green-100 text-green-600 flex items-center rounded-md">
          <CheckCircle className="mr-2" />
          Agendamento salvo com sucesso!
        </div>
      )}
    </section>
  );
}
