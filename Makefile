
link:
	sfdx plugins:link .

run-query:
	bin/run query:soql -f ./scripts/accounts.soql -u $(user)

run-query-contacts:
	bin/run query:soql -f ./scripts/contacts.soql -u $(user) 

run-create:
	bin/run crud:create -s Account -f ./scripts/account.json -u $(user)

test-create:
	sfdx crud:create -s Account -f /tmp/account.json -u $(user)

run-update:
	bin/run crud:update -s Account -f ./scripts/update-account.json -u $(user)

run-relationships:
	bin/run describe:relationships -s Account -u $(user)

test-relationships:
	sfdx describe:relationships -s Account -u $(user)

open:
	sfdx force:org:open -u $(user)

publish:
	npm publish --access public 


#
# WIP Work in Progress: an end to end testing framework
#
WIP_HOME = ./scripts/wip
RUNID = run001

wip:
	bin/run wip:run -r $(RUNID) -f $(WIP_HOME)/setup.json -u $(user)

#
# UI API 
#

ui:
	bin/run ui:call -s Case -p Foods__c -r 012610000002pGnAAI -u $(user)

ui-cb:
	bin/run ui:call -s Case -p s_Sub_category__c -r 0126A000000VHhkQAG -u $(user)
	bin/run ui:call -s Object_A__c -p Foods__c -r 012610000002pGnAAI -u $(user)

#
# GEN LOAD GENERATOR
#
# Requires scatch org 'sim' be brought up and populated
#
gen:
	bin/run gen:run -i 5 -e /sim -u sim
