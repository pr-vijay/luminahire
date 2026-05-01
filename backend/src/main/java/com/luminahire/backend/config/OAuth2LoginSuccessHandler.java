package com.luminahire.backend.config;

import com.luminahire.backend.model.UserProfile;
import com.luminahire.backend.repository.UserProfileRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserProfileRepository profileRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture"); // Google
        if (picture == null) picture = oauthUser.getAttribute("avatar_url"); // GitHub/Others
        
        if (email == null) {
            response.sendRedirect("http://localhost:5173/login?error=Email+not+provided+by+provider");
            return;
        }

        // Sync with our database
        Optional<UserProfile> profileOpt = profileRepo.findByEmail(email);
        UserProfile profile;
        if (profileOpt.isPresent()) {
            profile = profileOpt.get();
        } else {
            profile = new UserProfile();
            profile.setEmail(email);
        }
        
        profile.setName(name);
        if (picture != null) profile.setAvatar(picture);
        profileRepo.save(profile);

        // Redirect back to frontend with user data
        // In a real production app, you would send a JWT token here!
        String redirectUrl = String.format(
            "http://localhost:5173/login?success=true&email=%s&name=%s&avatar=%s",
            URLEncoder.encode(email, StandardCharsets.UTF_8),
            URLEncoder.encode(name != null ? name : "", StandardCharsets.UTF_8),
            URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8)
        );
        
        response.sendRedirect(redirectUrl);
    }
}
