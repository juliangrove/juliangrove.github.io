import boto3
import pandas

ENVIRONMENT = "prod"

if ENVIRONMENT == "sandbox":
    profile_name = 'sidvash-mturk-personal'
    endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
    worker_hostname = 'https://workersandbox.mturk.com'
elif ENVIRONMENT == "prod":
    profile_name = 'mechanical-turk-full-access-664832914776'
    endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'
    worker_hostname = 'https://www.worker.mturk.com'
elif ENVIRONMENT == "old_factslab_prod":
    profile_name = 'default'
    endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'
    worker_hostname = 'https://www.worker.mturk.com'

region_name = "us-east-1"
profile_name = "mechanical-turk-full-access-664832914776"

# Create a new session using the specified profile
session = boto3.Session(profile_name=profile_name)

# Create a new MTurk client using the session
mturk = session.client('mturk',
                       endpoint_url = endpoint_url,
                       region_name = region_name)

PROJECTION_QUAL_ID = "3OPOXV2R3J18RJJWAWNU25CUEM08IJ"
PRIOR_QUAL_ID = "3O3TG57J9X14MU32SE8UE6RUR1P8JV"
TEMPLATIC_QUAL_ID = "3O3TG57J9X14MU32SE8UE6RUR1PJ86"
BLEACHED_QUAL_ID = "3KNFVBDQIYCBJRWAUP3S5K4NC6R03O"

def qualify_projection_worker(worker_id: str, score: int) -> dict[str, any]:
    return mturk.associate_qualification_with_worker(
        QualificationTypeId=PROJECTION_QUAL_ID, WorkerId=worker_id, IntegerValue=score, SendNotification=False
    )

projection = pandas.read_csv("workers.csv")

for i in range(0, len(projection)):
    qualify_projection_worker(projection.iloc[i]["worker_id"], int(projection.iloc[i]["score"]))

# def create_projection_qualification() -> dict[str, any]:
#     return mturk.create_qualification_type(
#         Name="bleached",
#         Description="Workers who participated in the bleached projection experiment.",
#         QualificationTypeStatus="Active",
#         AutoGranted=False,
#         )

# create_projection_qualification()
