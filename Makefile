

link:
	sfdx plugins:link .

run-query:
	bin/run query:soql -f /tmp/accounts.soql -u $(user)

run-query-contacts:
	bin/run query:soql -f ./scripts/contacts.soql -u $(user)


run-create:
	bin/run crud:create -s Account -f /tmp/account.json -u $(user)

test-create:
	sfdx crud:create -s Account -f /tmp/account.json -u $(user)

open:
	sfdx force:org:open -u $(user)

publish:
	npm publish --access public 
