import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { default as FullCalendar } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { fetchTrainings } from "./api";
import "./styles.css";
const CalendarPage = () => {
    const [events, setEvents] = useState<EventInput[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await fetchTrainings();
            const mappedEvents = data.map((training: any) => {
                const startDate = new Date(training.date);
                let endDate = null;

                // Check if duration is valid and calculate the end time
                if (training.duration && training.duration > 0) {
                    endDate = new Date(startDate.getTime() + training.duration * 60000); // Add duration in minutes
                }

                return {
                    id: training.id,
                    title: training.activity,
                    start: startDate.toISOString(),
                    end: endDate ? endDate.toISOString() : startDate.toISOString(), // Use endDate or fallback to startDate
                    extendedProps: {
                        customer: training.customer
                            ? `${training.customer.firstname} ${training.customer.lastname}`
                            : "N/A",
                    },
                };
            });
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error fetching training events", error);
        }
    };

    return (
        <div
            className="calendar-page"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "calc(100vh - 64px)", // Subtract the navbar height
                overflow: "hidden", // Prevent scrolling
            }}
        >
            <h1 style={{ margin: "16px 0" }}>Trainings Calendar</h1>
            <div style={{ flex: 1, width: "100%" }}>
                <FullCalendar
                    scrollTime="07:00:00"
                    height="100%" // Make the calendar fill the available space
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    firstDay={1} // Start the week on Monday
                    displayEventEnd={true}
                    eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                    slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                    slotDuration="00:15:00"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    events={events}
                    eventClick={(info) => {
                        // Prevent the default browser behavior
                        info.jsEvent.preventDefault();

                        // Extract event details
                        const title = info.event.title;
                        const customer = info.event.extendedProps.customer;
                        // Format start and end times in 24-hour format
                        const start = info.event.start?.toLocaleString("en-GB", { // Use "en-GB" for 24-hour format
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        });
                        const end = info.event.end?.toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        });

                        const duration = info.event.end && info.event.start
                            ? Math.round((info.event.end.getTime() - info.event.start.getTime()) / 60000) // Calculate duration in minutes
                            : "N/A";

                        // Display an alert with all details
                        alert(
                            `Event: ${title}\n` +
                            `Customer: ${customer}\n` +
                            `Start: ${start}\n` +
                            `End: ${end}\n` +
                            `Duration: ${duration} minutes`
                        );
                    }}
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