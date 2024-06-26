import React, { useState } from 'react'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    NativeSelect,
    ToggleButton,
    ToggleButtonGroup
  } from "@mui/material";
import CreateEventForm from "@/components/molecules/CreateEventForm";
import EditEventForm from "@/components/molecules/EditEventForm";
import styles from "@/app/admin/admin.module.css";


function getEvents(){
    return [
      {
        "id": 145223,
        "titlu": "Event 1",
        "data": "2023-07-27T12:21",
        "locatie": "Timisoara",
        "descriere": "Descriere 1",
        "users": [
            "user 1",
            "user 2",
            "user 4"
        ],
        "groups": [
            "departament 2",
            "departament 3"
        ]
    },
    {
      "id": 124324,
      "titlu": "Event 2",
      "data": "2023-07-27T12:21",
      "locatie": "Sibiu",
      "descriere": "Descriere 2",
      "users": [
          "user 1",
          "user 3",
          "user 4"
      ],
      "groups": [
          "departament 1",
          "departament 3"
      ]
  }
    ]
  }

export default function ManageEvents() {

    const events = getEvents()

    const [selectedValue, setSelectedValue] = useState("create");
    const [selectedEvent, setSelectedEvent] = useState(events[0]);
  
    const handleToggleChange = (event, newValue) => {
      setSelectedValue(newValue);
      if (newValue === "edit") {
        setShowEvets(true)
      }
    };
  
    const [editEvent, setEditEvent] = useState(false)
    const [showEvets, setShowEvets] = useState(false)
  
    const hideEditEvent = () => {
      setEditEvent(false)
      setShowEvets(false)
      setSelectedValue("create")
    }
  
    const handleEventChange = (eventSel) => {
      const selectedEventObject = events.find((event) => event.id === Number(eventSel.target.value));
      setSelectedEvent(selectedEventObject);
      setShowEvets(false)
    };

  return <>

    <ToggleButtonGroup
    className={styles.toggleGroup}
    value={selectedValue}
    exclusive
    onChange={handleToggleChange}
    >
        <ToggleButton value="create" >
            Create
        </ToggleButton>
        <ToggleButton value="edit" >
            Edit
        </ToggleButton>
    </ToggleButtonGroup>


    {selectedValue === "create" ? <CreateEventForm /> : 
        showEvets ?
        <>
        <div className={styles.overlay}></div>
            <div className={styles.modalContent}>
                <div className={styles.controllContainer}>
                    <p>Select Event</p>
                    <input onClick={hideEditEvent} className={`${styles.button} ${styles.noMarg}`} type="submit" value="Cancel" />
                </div>

                <FormControl fullWidth>
                    <NativeSelect
                    className={styles.input}
                    inputProps={{
                        name: 'event'    
                    }}
                    value={selectedEvent}
                    onChange={handleEventChange}
                    >
                        {events && events.map((event) => (
                            <option key={event.id} value={event.id}>{event.titlu}</option> 
                        ))}
                    </NativeSelect>
                </FormControl>
            </div>
        </> :
        <EditEventForm event={selectedEvent} />

    }

    </>
}


