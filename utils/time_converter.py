from datetime import datetime
import pytz
import tzlocal


def convert_time(time):
    # Localize the naive UTC datetime
    time = pytz.utc.localize(time)

    # get local time zone
    local_tz = tzlocal.get_localzone()

    local_datetime = time.astimezone(local_tz)

    # Format the datetime
    local_datetime_str = local_datetime.strftime("%Y-%m-%d %H:%M:%S %Z")
    return local_datetime_str
