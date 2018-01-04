# s3-backup

The simplest way to backup a file to S3.

Sometimes you just want to back something up with minimal configuration. No retained backups, nothing fancy, just a backup that's not on the same server. I think this might be the easiest solution I've seen. And it is super cheap, possibly free! S3's free tier gives you 5GB of data and 15GB of transfer for free. After that, [pricing is still very cheap](https://aws.amazon.com/s3/pricing/). It can be even cheaper if you choose Reduced Redundancy Storage, but I wouldn't recommend that for a backup.

First, log into AWS and create an S3 Bucket. Remember the name of the bucket. You can choose Reduced Redundancy Storage at this point.

Next, make sure you have your AWS credentials set up. See the AWS documentation for this. You'll need to use the ~/.aws/credentials file approach. Make sure the `[default]` header is set to the same account you created the S3 bucket with.

Next, install this package. You can do this on your local machine or the machine you're backing up. You must have the AWS credentials on the machine you use to generate the URL.

    npm install -g s3-backup

You can then generate an upload and download URL like this:

    s3-backup $BUCKET_NAME $FILENAME

You should get some output like this:

    You can upload to this URL like this:

        curl "https://s3.amazonaws.com/$BUCKET_NAME/$FILENAME?AWSAccessKeyId=SOME_KEY&Expires=1830442652&Signature=SOME_SIGNATURE" --upload-file FILENAME

    You can then download the file like this:

        curl -o FILENAME "https://s3.amazonaws.com/$BUCKET_NAME/$FILENAME?AWSAccessKeyId=SOME_KEY&Expires=1830442652&Signature=ANOTHER_SIGNATURE"

Now, on the machine you want to backup, create a file `backup.sh`. In my case, the file was at `/home/ubuntu/backup.sh`.

    #!/bin/bash

    # Create an archive of the folder we want to backup (in this game, the game Starbound, which is a ton of fun).
    tar czvf /home/ubuntu/starbound.tar.gz /home/ubuntu/starbound_game

    # Now we save the file to S3. Make sure the URL is in quotes like below!
    curl "THE URL POSTED ABOVE" --upload-file /home/ubuntu/starbound.tar.gz

Now we're going to create a cronjob to do this nightly. The 9 hour in UTC translates to 3am in Central time when it isn't daylight savings time.

    crontab -e

    # Add this to the bottom and the exit the editor. Adjust the path for where you saved your script.
    0 9 * * * bash /home/ubuntu/backup.sh

And that's it!
