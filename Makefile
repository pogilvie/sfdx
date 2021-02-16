

link:
	sfdx plugins:link .

run:
	bin/run crud:create -s Account -f /tmp/account.json -u $(user)

test-create:
	sfdx crud:create -s Account -f /tmp/account.json -u $(user)

open:
	sfdx force:org:open -u $(user)

publish:
	npm publish --access public 
