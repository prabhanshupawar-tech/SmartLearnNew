package com.smartlearn.smartlearn.controller;

import com.smartlearn.smartlearn.entity.User;
import com.smartlearn.smartlearn.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
          .map(ResponseEntity::ok)
          .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return userRepository.findById(id).map(user -> {
            try {
                user.setPhoto(file.getBytes());
                userRepository.save(user);
                return ResponseEntity.ok().build();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = "/{id}/photo", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<?> getPhoto(@PathVariable Long id) {
        return userRepository.findById(id)
          .map(user -> {
              byte[] img = user.getPhoto();
              if (img == null || img.length == 0) {
                  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
              }
              return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(img);
          })
          .orElse(ResponseEntity.notFound().build());
    }
}
