# Models

This directory contains code for models provided by this app.

1. Currently, every field in each model can be obtained directly from the corresponding GitHub REST API.
2. The GitHub REST API identifies a user with **nickname**, a repository with **name**, an issue with **number** along with its repo. Although it provides a number `ID` for these fields which is used as primary key here, the `ID` **won't work when accessing the REST API**.
3. A common user and an organization are both regarded as GitHub users. So the `org_id` field of `github-user` saves the ID of the same model.
4. The tree of a commit will be saved as a string serialized from recursively generated JSON.
