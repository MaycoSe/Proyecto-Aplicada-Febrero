-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@camp.com', '$2a$10$rKZLvXZZZZZZZZZZZZZZZuK8qVqVqVqVqVqVqVqVqVqVqVqVqVqVq', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample clubs
INSERT INTO clubs (name, code, description) VALUES
('Eagles Club', 'EGL', 'The mighty eagles soaring high'),
('Lions Club', 'LNS', 'Brave and fearless lions'),
('Tigers Club', 'TGR', 'Swift and powerful tigers'),
('Bears Club', 'BRS', 'Strong and resilient bears'),
('Wolves Club', 'WLV', 'Pack hunters with great teamwork')
ON CONFLICT (code) DO NOTHING;

-- Insert sample events
INSERT INTO events (name, event_type, description, max_score, weight) VALUES
('Opening Ceremony Performance', 'Performance', 'Grand opening ceremony showcase', 100.00, 1.50),
('Team Building Challenge', 'Challenge', 'Collaborative problem-solving activity', 100.00, 1.00),
('Sports Competition', 'Sports', 'Athletic events and competitions', 100.00, 1.25),
('Creative Arts Showcase', 'Arts', 'Display of artistic talents', 100.00, 1.00),
('Leadership Workshop', 'Workshop', 'Leadership skills demonstration', 100.00, 0.75)
ON CONFLICT DO NOTHING;
