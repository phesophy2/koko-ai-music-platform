use aws_sdk_s3::{Client, config::{Config, Region}};

pub async fn create_s3_client(region: &str, access_key: &str, secret_key: &str) -> Client {
    let config = Config::builder()
        .region(Region::new(region.to_string()))
        .credentials_provider(aws_sdk_s3::config::Credentials::new(
            access_key,
            secret_key,
            None,
            None,
            "koko",
        ))
        .build();

    Client::from_conf(config)
}

pub async fn upload_audio(client: &Client, bucket: &str, key: &str, data: Vec<u8>) -> Result<String, anyhow::Error> {
    client
        .put_object()
        .bucket(bucket)
        .key(key)
        .body(data.into())
        .content_type("audio/mpeg")
        .send()
        .await?;

    Ok(format!("https://{}.s3.amazonaws.com/{}", bucket, key))
}
