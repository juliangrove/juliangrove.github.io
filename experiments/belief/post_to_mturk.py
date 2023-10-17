import boto3
from boto.mturk.question import ExternalQuestion

ENVIRONMENT = "prod"

if ENVIRONMENT == "sandbox":
    profile_name = 'jgrove-mturk-personal'
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

question = ExternalQuestion("https://juliangrove.github.io/experiments/5/experiment.html", frame_height=675)
quals = [{
    'QualificationTypeId': '36MND4DYP1J7D5FDLZCZ4FARYA86Y1',
    'Comparator': 'GreaterThanOrEqualTo',
    'IntegerValues': [90],
    'RequiredToPreview': True,
},
         {
    'QualificationTypeId': '3OPOXV2R3J18RJJWAWNU25CUEM08IJ',
    'Comparator': 'DoesNotExist',
    'RequiredToPreview': True,
         },
         {
    'QualificationTypeId': '3O3TG57J9X14MU32SE8UE6RUR1P8JV',
    'Comparator': 'DoesNotExist',
    'RequiredToPreview': True,
         },
         {
    'QualificationTypeId': '3KNFVBDQIYCBJRWAUP3S5K4NC6R03O',
    'Comparator': 'DoesNotExist',
    'RequiredToPreview': True,
         },
         {
    'QualificationTypeId': '3O3TG57J9X14MU32SE8UE6RUR1PJ86',
    'Comparator': 'DoesNotExist',
    'RequiredToPreview': True,
         }]
new_hit = mturk.create_hit(
    Keywords = 'language, questions, game, fun, experiment, research',
    Title = 'How certain is someone?',
    RequesterAnnotation = 'projection-only',
    Description = 'Say how certain you think someone is about something, given something they heard and some fact as background information.',
    Reward = '2',
    MaxAssignments = 252,
    LifetimeInSeconds = 168 * 60 * 60,
    AssignmentDurationInSeconds = 60 * 60,
    AutoApprovalDelayInSeconds = 24 * 60 * 60,
    Question = question.get_as_xml(),
    QualificationRequirements = quals,
)
print("A new HIT has been created. You can preview it here:")
print("https://worker.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'])
# print("https://workersandbox.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'])
print("HITID = " + new_hit['HIT']['HITId'] + " (Use to Get Results)")

# +---------+
# | Results |
# +---------+

# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=301G7MYOBY0IXAUFIN2WKN1X3PB53E
# HITID = 3OZ4VAIBFCI9BID79U2MT9Q3JNCJVN (Use to Get Results)

# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MB19ID77CBI6BGE02YIO0001U761Q
# HITID = 3UXQ63NLBPP0XU317YNZ8C9OKKQLBA (Use to Get Results)
