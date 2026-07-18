import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import caldav
from icalendar import Calendar
import recurring_ical_events
from dotenv import load_dotenv

load_dotenv()

DUBAI = ZoneInfo("Asia/Dubai")


def connect():
    client = caldav.DAVClient(
        url="https://caldav.icloud.com",
        username=os.getenv("ICLOUD_USERNAME"),
        password=os.getenv("ICLOUD_PASSWORD"),
    )
    return client.principal()


def fetch_all_vevents(principal):
    merged = Calendar()
    merged.add("version", "2.0")
    merged.add("prodid", "-//Glancer//Calendar//EN")

    for cal in principal.calendars():
        for event in cal.events():
            event_cal = Calendar.from_ical(event.data)
            for component in event_cal.walk():
                if component.name == "VEVENT":
                    merged.add_component(component)

    return merged


def expand_events(merged_cal, start, end):
    occurrences = recurring_ical_events.of(merged_cal).between(start, end)

    events = []
    for occ in occurrences:
        summary = occ.get("SUMMARY")
        if summary is None:
            continue

        dtstart = occ.decoded("DTSTART")
        is_all_day = not isinstance(dtstart, datetime)  # date, not datetime

        dtend = occ.decoded("DTEND") if occ.get("DTEND") else None

        events.append({
            "title": str(summary),
            "all_day": is_all_day,
            "start": dtstart.isoformat(),
            "end": dtend.isoformat() if dtend else None,
        })

    events.sort(key=lambda e: e["start"])
    return events


def get_todays_events():
    now = datetime.now(DUBAI)
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1)

    principal = connect()
    merged_cal = fetch_all_vevents(principal)
    return expand_events(merged_cal, start, end)


if __name__ == "__main__":
    import json
    print(json.dumps(get_todays_events(), indent=2))