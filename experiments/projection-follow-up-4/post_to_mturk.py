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

question = ExternalQuestion("https://juliangrove.github.io/experiments/2/experiment.html", frame_height=675)
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
    Reward = '1',
    MaxAssignments = 32,
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

# New HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MB19ID77CBI6BGE02YIO0001U761Q
# HITID = 3V8JSVE8ZDTI4WMK04EF3SH5W60YES (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MB19ID77CBI6BGE02YIO0001U761Q
# HITID = 3LCXHSGDM89L8AAB1YMQL6T4FK1SE3 (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MB19ID77CBI6BGE02YIO0001U761Q
# HITID = 3VP28W7DV2NAF0WLR104ZHB7EZEFZ9 (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MB19ID77CBI6BGE02YIO0001U761Q
# HITID = 3X4Q1O9UCWPL133879RBVRRMW5OO74 (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MGKBFT74NL8UBQH971PC8YS4JXJSW
# HITID = 3N3WJQXELT3JF2Z808OMQND101I2L3 (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MGKBFT74NL8UBQH971PC8YS4JXJSW
# HITID = 3P7QK0GJ3UY3KRGCF9FVY2OZF0R2Z3 (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MGKBFT74NL8UBQH971PC8YS4JXJSW
# HITID = 3IV1AEQ4DSQO6RDXD4LAKZDCIY7J8V (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=3MGKBFT74NL8UBQH971PC8YS4JXJSW
# HITID = 3N2YPY1GI7BE6NNI7WLTFXKSOJAEVY (Use to Get Results)

# Old HIT:
# A new HIT has been created. You can preview it here:
# https://worker.mturk.com/mturk/preview?groupId=30P8A0FV02HR4GWMC31WNDT9W5CKR3
# HITID = 37AQKJ12TY11IE1QSWA9D1W8R4UTTP (Use to Get Results)
