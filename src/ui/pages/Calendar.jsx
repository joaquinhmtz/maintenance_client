import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import {
  Card,
  CardContent,
  Box,
  Chip,
  Typography
} from "@mui/material";

const doctorColors = {
  ana: "#1976d2",
  angelica: "#4caf50"
};

export default function Calendar() {

  const appointments = [
    {
      id: "1",
      title: "Ana Karen M",
      start: "2026-06-10T09:00:00",
      end: "2026-06-10T09:30:00",
      extendedProps: {
        doctor: "ana"
      }
    },
    {
      id: "2",
      title: "Angélica",
      start: "2026-06-11T10:00:00",
      end: "2026-06-11T10:30:00",
      extendedProps: {
        doctor: "angelica"
      }
    },
    {
      id: "3",
      title: "Paciente Erick",
      start: "2026-06-09T08:00:00",
      end: "2026-06-09T08:30:00",
      extendedProps: {
        doctor: "angelica"
      }
    }
  ];

  const events = appointments.map(item => ({
    ...item,
    backgroundColor:
      doctorColors[item.extendedProps.doctor],
    borderColor:
      doctorColors[item.extendedProps.doctor]
  }));

  const handleDateClick = (info) => {
     const currentView = info.view.type;

    if (currentView !== "dayGridMonth") {
      return;
    }

    // Abrir modal
    // setSelectedDate(info.dateStr);
    // setOpenAppointmentModal(true);

    console.log("Nueva cita:", info.dateStr);
  };

  const handleEventClick = (info) => {
    console.log(info.event);

    alert(
      `Paciente: ${info.event.title}`
    );
  };

  return (
    <Card elevation={0}>
      <CardContent>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2
          }}
        >
          <Chip
            label="Dra. Ana"
            sx={{
              bgcolor: doctorColors.ana,
              color: "#fff"
            }}
          />

          <Chip
            label="Dra. Angélica"
            sx={{
              bgcolor: doctorColors.angelica,
              color: "#fff"
            }}
          />
        </Box>

        <FullCalendar
          plugins={[
            timeGridPlugin,
            interactionPlugin,
            dayGridPlugin
          ]}

          locale="es"

          initialView="timeGridWeek"

          // locale={esLocale}

          selectable={false}

          editable={false}

          eventStartEditable={false}

          eventDurationEditable={false}

          dateClick={handleDateClick}

          eventClick={handleEventClick}

          events={events}

          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
        />
      </CardContent>
    </Card>
  );
}