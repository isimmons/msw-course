# Starting Commit

For the course starting point I created a new updated remix project and copied over the routes/ui from Artem's starting project for the course.

There are some code changes due to changes in the latest remix version.

Also react-icons all icons cause error "React does not recognize dataSlot" which is an attribute on the svgs. Changing it to dataslot myself in the package did not make a difference so after a while trying to solve the issue, I just removed react-icons and replaced it with @remixicon/react.

There are probably still some issues but currently I am only getting errors that (as far as I can tell) are caused by the fact that we havn't started implementing api mock handlers yet.
