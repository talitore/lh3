# Implementation Notes - Phase 4 API Endpoints

## AWS S3 Setup for Photo Uploads

To implement the photo upload functionality using S3 pre-signed URLs, the following AWS resources and configurations are required:

1.  **S3 Bucket:**

    - A dedicated S3 bucket to store the uploaded photos.
    - **Bucket Name:** This will be required as an environment variable (e.g., `S3_BUCKET_NAME`).
    - **Region:** The AWS region where the bucket is located (e.g., `AWS_REGION`, like `us-east-1`).
    - **Permissions (CORS):** Configure CORS (Cross-Origin Resource Sharing) on the bucket to allow `PUT` requests from your application's domain. This is crucial for the client-side to directly upload to S3 using the pre-signed URL.
      Example CORS Configuration (adjust `AllowedOrigins` as needed):
      ```xml
      <CORSConfiguration>
       <CORSRule>
         <AllowedOrigin>https://your-app-domain.com</AllowedOrigin> <!-- Or http://localhost:3000 for dev -->
         <AllowedMethod>PUT</AllowedMethod>
         <AllowedHeader>*</AllowedHeader>
         <MaxAgeSeconds>3000</MaxAgeSeconds>
         <ExposeHeader>ETag</ExposeHeader>
       </CORSRule>
      </CORSConfiguration>
      ```
    - **Public Access:** Decide on the public accessibility of objects. If photos should be publicly viewable via a direct S3 URL (or CloudFront), the bucket/objects will need appropriate policies. Otherwise, if you intend to serve images via your API (e.g., by streaming or generating temporary signed GET URLs), they can remain private.

2.  **IAM User & Permissions:**

    - An IAM user with programmatic access (access key ID and secret access key).
    - These credentials will be used by the Next.js backend to interact with S3 (specifically to generate pre-signed URLs).
    - Store these as environment variables: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
    - **Permissions Policy:** Attach a policy to this IAM user (or its group) that grants necessary S3 permissions. For generating pre-signed PUT URLs, the user needs at least `s3:PutObject` permission on the specific bucket and objects. It might also need `s3:GetObject` if you plan to read objects or `s3:ListBucket` for other operations, but for pre-signed PUT, `s3:PutObject` is key.
      Example IAM Policy (restrict `Resource` to your bucket):
      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "s3:PutObject",
              "s3:PutObjectAcl" // If you need to set ACLs during upload
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
          }
        ]
      }
      ```

3.  **Environment Variables in Next.js Application:**
    Ensure the following environment variables are set up in your `.env.local` (for development) and in your deployment environment:
    - `S3_BUCKET_NAME`: Your S3 bucket name.
    - `AWS_REGION`: The AWS region of your S3 bucket (e.g., `us-east-1`).
    - `AWS_ACCESS_KEY_ID`: IAM user's access key ID.
    - `AWS_SECRET_ACCESS_KEY`: IAM user's secret access key.

**Summary of Actions for AWS Setup:**

- [x] Create S3 Bucket.
- [x] Configure CORS on the S3 Bucket.
- [x] Determine public access settings for S3 objects.
- [x] Create IAM User with programmatic access.
- [x] Attach the necessary S3 permissions policy to the IAM User.
- [x] Configure environment variables (`S3_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) in the Next.js application.

---

_(Existing notes, if any, will be preserved below this section)_
