pub fn generate_hex_id() -> String {
    use rand::Rng;
    let chars: Vec<char> = "0123456789ABCDEF".chars().collect();
    let mut rng = rand::thread_rng();
    (0..6).map(|_| chars[rng.gen_range(0..chars.len())]).collect()
}
