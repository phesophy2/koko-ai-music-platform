mod config;
mod db;
mod models;
mod services;
mod api;
mod auth;
mod error;
mod queue;
mod storage;
mod utils;

use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use tracing_subscriber::EnvFilter;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let config = config::Config::from_env();
    let db_pool = db::create_pool(&config.database_url).await;
    let nats_client = queue::create_client(&config.nats_url).await;

    log::info!("Starting KOKO backend on port {}", config.app_port);
    log::info!("Environment: {}", config.app_env);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(nats_client.clone()))
            .app_data(web::Data::new(config.clone()))
            .configure(api::routes::configure)
    })
    .bind(("0.0.0.0", config.app_port))?
    .run()
    .await
}
