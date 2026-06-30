use actix_web::web;
use super::handlers;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/v1")
            .service(handlers::auth::register)
            .service(handlers::auth::login)
            .service(handlers::artists::list_artists)
            .service(handlers::artists::get_artist)
            .service(handlers::projects::create_project)
            .service(handlers::projects::list_projects)
            .service(handlers::projects::get_project)
            .service(handlers::projects::update_project)
            .service(handlers::projects::delete_project)
            .service(handlers::songs::list_songs)
            .service(handlers::songs::get_song)
            .service(handlers::songs::stream_song)
            .service(handlers::songs::like_song)
            .service(handlers::dashboard::dashboard_stats)
            .service(handlers::dashboard::dashboard_recent)
    );
}
