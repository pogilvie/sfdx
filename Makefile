
user = blog

link:
	sfdx plugins:link .


#
# Big Object Topic
#

hello:
	bin/run big:hello -u $(user)


publish:
	npm publish --access public 
