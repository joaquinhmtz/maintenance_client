import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import {
  Card,
  CardContent,
  Box,
  Typography
} from "@mui/material";
import workOrderServices from "../../services/workOrders";
import useNotification from "../../../hooks/useNotification";
import PageHeader from "./../components/common/pageHeader";
import ChipLabel from "./../components/common/ChipLabel";
import KpisCalendar from "./../components/workOrder/KpisCalendar";
import MonthProgressBar from "./../components/workOrder/MonthProgressBar";
import DayWorkOrdersModal from "./../components/workOrder/DayWorkOrdersModal";
import { TYPES_CHIPS } from "./../../theme/variables";
import { getOverdueDatesSet, getMonthProgress, toLocalDateStr } from "./../../../utils/calendar.helper";

const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

export default function Calendar() {

  const colors = TYPES_CHIPS["TYPE_SERVICES"];
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    ...getCurrentMonthRange()
  });
  const [appointments, setAppointments] = useState([]);
  const { showError } = useNotification();

  const overdueDates = useMemo(() => getOverdueDatesSet(appointments), [appointments]);
  const monthProgress = useMemo(() => getMonthProgress(appointments), [appointments]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dayModalOpen, setDayModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCalendarWorkOrders();
  }, [filters]);

  const getCalendarWorkOrders = async () => {
    try {
      const response = await workOrderServices.calendarWorkOrders({
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      setAppointments(response?.data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener las solicitudes: ", err);
      showError("Hubo un error al obtener las solicitudes");
    }
  }

  const events = appointments.map(item => {
    const vencido = overdueDates.has(toLocalDateStr(item.start));
    const styleKey = vencido ? "VENCIDO" : item.extendedProps.typeService.toUpperCase();
    const styleConfig = colors[styleKey];

    return {
      ...item,
      backgroundColor: styleConfig.bgcolor,
      borderColor: styleConfig.dot,
      textColor: styleConfig.color
    };
  });

  const ordersForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const targetStr = toLocalDateStr(selectedDate);
    return events.filter(ev => toLocalDateStr(ev.start) === targetStr);
  }, [selectedDate, events]);

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setDayModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedDate(info.event.start);
    setDayModalOpen(true);
  };

  const handleDatesSet = (info) => {
    const newStartDate = info.view.currentStart.toISOString();
    const newEndDate = info.view.currentEnd.toISOString();

    setFilters(prev => {
      if (prev.startDate === newStartDate && prev.endDate === newEndDate) {
        return prev;
      }
      return {
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate
      };
    });
  };

  return (
    <>
      <PageHeader
        title="Calendario"
        subtitle="Calendarización de las ordenes de servicio"
      />

      <KpisCalendar {...monthProgress} />
      <MonthProgressBar {...monthProgress} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, mb: 1 }}>
        <ChipLabel typeChip={"TYPE_SERVICES"} chip="PREVENTIVO" />
        <ChipLabel typeChip={"TYPE_SERVICES"} chip="CORRECTIVO" />
        <ChipLabel typeChip={"TYPE_SERVICES"} chip="VENCIDO" />
      </Box>

      <Card elevation={0}>
        <CardContent>

          <Box
            sx={{
              "& .fc-day-overdue": {
                backgroundColor: "#fcebeb !important"
              },
              "& .fc-day-overdue .fc-daygrid-day-number": {
                color: "#791f1f",
                fontWeight: 700
              },
              "& .fc-day-overdue.fc-daygrid-day": {
                border: "1px solid #a32d2d"
              }
            }}
          >

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}

              locale={esLocale}

              initialView="dayGridMonth"

              selectable={false}

              editable={false}

              eventStartEditable={false}

              eventDurationEditable={false}

              dateClick={handleDateClick}

              eventClick={handleEventClick}

              datesSet={handleDatesSet}

              events={events}

              height="auto"
              eventDisplay="block"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: ""
              }}
              eventContent={(arg) => {
                const { folio, hospital, typeService } = arg.event.extendedProps;
                const chipStyle = colors[typeService?.toUpperCase()];

                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      px: "4px",
                      py: "2px",
                      overflow: "hidden",
                      lineHeight: 1.2,
                    }}
                  >
                    {chipStyle?.dot && (
                      <Box
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: chipStyle.dot,
                          flexShrink: 0
                        }}
                      />
                    )}
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        component="div"
                        sx={{ fontSize: 10, fontWeight: 700, color: "inherit" }}
                        noWrap
                      >
                        {folio}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{ fontSize: 9, color: "inherit" }}
                        noWrap
                      >
                        {hospital}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
              dayCellClassNames={(arg) =>
                overdueDates.has(toLocalDateStr(arg.date)) ? ["fc-day-overdue"] : []
              }
            />
          </Box>
        </CardContent>
      </Card>

      <DayWorkOrdersModal
        open={dayModalOpen}
        onClose={() => setDayModalOpen(false)}
        date={selectedDate}
        orders={ordersForSelectedDate}
        // onViewDetail={handleViewDetail}
      />

    </>
  );
}