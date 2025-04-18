import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { default as FullCalendar } from "@fullcalendar/react";

import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";

const baseUrl = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

const CalendarPage = () => {
    const [events, setEvents] = useState<EventInput[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${baseUrl}gettrainings`);
            const data = await res.json();
            const mappedEvents = data.map((training: any) => ({
                id: training.id,
                title: training.activity,
                start: training.date,
                extendedProps: {
                    customer: training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : "N/A"
                }
            }));
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error fetching training events", error);
        }
    };

    return (
        <div className="calendar-page" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Trainings Calendar</h1>
            <div style={{ width: "70%" }}>
                <FullCalendar
                    scrollTime="07:00:00"
                    height="70vh"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                    slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    events={events}
                    eventDidMount={(info) => {
                        const customer = info.event.extendedProps.customer;
                        if (customer && customer !== "N/A") {
                            info.el.setAttribute("title", `Customer: ${customer}`);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default CalendarPage;