package com.dsaplatform.service;

import com.dsaplatform.model.entity.*;
import com.dsaplatform.repository.*;
import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Property-based tests for Lesson Progress.
 * 
 * **Feature: platform-enhancements, Property 4: User Progress Isolation**
 * **Validates: Requirements 4.6**
 * 
 * *For any* two distinct users A and B, completing a lesson for user A 
 * SHALL NOT affect the progress records of user B.
 */
@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class LessonProgressPropertyTest {

    @Autowired
    private LessonProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GamificationService gamificationService;

    private User userA;
    private User userB;
    private List<Lesson> testLessons;

    @BeforeEach
    void setUp() {
        // Clean up
        progressRepository.deleteAll();
        lessonRepository.deleteAll();
        chapterRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();

        // Create two test users
        userA = User.builder()
                .username("userA")
                .email("userA@test.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.STUDENT)
                .points(0)
                .streak(0)
                .level(1)
                .build();
        userA = userRepository.save(userA);

        userB = User.builder()
                .username("userB")
                .email("userB@test.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.STUDENT)
                .points(0)
                .streak(0)
                .level(1)
                .build();
        userB = userRepository.save(userB);

        // Create test course structure with multiple lessons
        Course course = Course.builder()
                .title("Test Course")
                .description("Test Description")
                .difficulty(Course.Difficulty.BEGINNER)
                .duration(60)
                .build();
        course = courseRepository.save(course);

        Chapter chapter = Chapter.builder()
                .course(course)
                .title("Test Chapter")
                .description("Test Chapter Description")
                .order(1)
                .build();
        chapter = chapterRepository.save(chapter);

        // Create 5 test lessons
        testLessons = new java.util.ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            Lesson lesson = Lesson.builder()
                    .chapter(chapter)
                    .title("Lesson " + i)
                    .content("Content for lesson " + i)
                    .order(i)
                    .duration(30)
                    .build();
            testLessons.add(lessonRepository.save(lesson));
        }
    }

    /**
     * **Feature: platform-enhancements, Property 4: User Progress Isolation**
     * **Validates: Requirements 4.6**
     * 
     * Property: Completing a lesson for user A does not affect user B's progress.
     */
    @Test
    @DisplayName("Property 4: User progress isolation - completing lesson for user A does not affect user B")
    @Transactional
    void userProgressIsolation_completingLessonForUserA_doesNotAffectUserB() {
        // Get initial progress for both users
        List<LessonProgress> initialProgressA = progressRepository.findByUserId(userA.getId());
        List<LessonProgress> initialProgressB = progressRepository.findByUserId(userB.getId());
        
        assertThat(initialProgressA).isEmpty();
        assertThat(initialProgressB).isEmpty();

        // Complete first lesson for user A
        Lesson lessonToComplete = testLessons.get(0);
        LessonProgress progressA = LessonProgress.builder()
                .user(userA)
                .lesson(lessonToComplete)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
        progressRepository.save(progressA);

        // Verify user A has progress
        List<LessonProgress> progressAfterA = progressRepository.findByUserId(userA.getId());
        assertThat(progressAfterA).hasSize(1);
        assertThat(progressAfterA.get(0).getLesson().getId()).isEqualTo(lessonToComplete.getId());
        assertThat(progressAfterA.get(0).getCompleted()).isTrue();

        // Verify user B still has no progress
        List<LessonProgress> progressAfterB = progressRepository.findByUserId(userB.getId());
        assertThat(progressAfterB).isEmpty();
    }

    /**
     * **Feature: platform-enhancements, Property 4: User Progress Isolation**
     * **Validates: Requirements 4.6**
     * 
     * Property: Multiple lesson completions for user A do not affect user B's progress.
     */
    @Test
    @DisplayName("Property 4: User progress isolation - multiple completions for user A do not affect user B")
    @Transactional
    void userProgressIsolation_multipleCompletionsForUserA_doNotAffectUserB() {
        // Complete multiple lessons for user A
        for (int i = 0; i < 3; i++) {
            Lesson lesson = testLessons.get(i);
            LessonProgress progress = LessonProgress.builder()
                    .user(userA)
                    .lesson(lesson)
                    .completed(true)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }

        // Verify user A has 3 completed lessons
        List<LessonProgress> progressA = progressRepository.findByUserId(userA.getId());
        assertThat(progressA).hasSize(3);
        assertThat(progressA.stream().allMatch(LessonProgress::getCompleted)).isTrue();

        // Verify user B still has no progress
        List<LessonProgress> progressB = progressRepository.findByUserId(userB.getId());
        assertThat(progressB).isEmpty();
    }

    /**
     * **Feature: platform-enhancements, Property 4: User Progress Isolation**
     * **Validates: Requirements 4.6**
     * 
     * Property: Both users can complete the same lesson independently.
     */
    @Test
    @DisplayName("Property 4: User progress isolation - both users can complete same lesson independently")
    @Transactional
    void userProgressIsolation_bothUsersCanCompleteSameLessonIndependently() {
        Lesson sharedLesson = testLessons.get(0);

        // User A completes the lesson
        LessonProgress progressA = LessonProgress.builder()
                .user(userA)
                .lesson(sharedLesson)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
        progressRepository.save(progressA);

        // User B completes the same lesson
        LessonProgress progressB = LessonProgress.builder()
                .user(userB)
                .lesson(sharedLesson)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
        progressRepository.save(progressB);

        // Verify both users have their own progress records
        List<LessonProgress> userAProgress = progressRepository.findByUserId(userA.getId());
        List<LessonProgress> userBProgress = progressRepository.findByUserId(userB.getId());

        assertThat(userAProgress).hasSize(1);
        assertThat(userBProgress).hasSize(1);

        // Verify they are separate records
        assertThat(userAProgress.get(0).getId()).isNotEqualTo(userBProgress.get(0).getId());
        assertThat(userAProgress.get(0).getUser().getId()).isEqualTo(userA.getId());
        assertThat(userBProgress.get(0).getUser().getId()).isEqualTo(userB.getId());
    }

    /**
     * **Feature: platform-enhancements, Property 4: User Progress Isolation**
     * **Validates: Requirements 4.6**
     * 
     * Property: Users can have different completion states for the same lesson.
     */
    @Test
    @DisplayName("Property 4: User progress isolation - users can have different completion states")
    @Transactional
    void userProgressIsolation_usersCanHaveDifferentCompletionStates() {
        // User A completes lessons 0, 1, 2
        for (int i = 0; i < 3; i++) {
            LessonProgress progress = LessonProgress.builder()
                    .user(userA)
                    .lesson(testLessons.get(i))
                    .completed(true)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }

        // User B completes lessons 2, 3, 4
        for (int i = 2; i < 5; i++) {
            LessonProgress progress = LessonProgress.builder()
                    .user(userB)
                    .lesson(testLessons.get(i))
                    .completed(true)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }

        // Get completed lesson IDs for each user
        Set<Long> userACompletedIds = progressRepository.findByUserId(userA.getId()).stream()
                .filter(LessonProgress::getCompleted)
                .map(p -> p.getLesson().getId())
                .collect(Collectors.toSet());

        Set<Long> userBCompletedIds = progressRepository.findByUserId(userB.getId()).stream()
                .filter(LessonProgress::getCompleted)
                .map(p -> p.getLesson().getId())
                .collect(Collectors.toSet());

        // Verify user A has lessons 0, 1, 2
        assertThat(userACompletedIds).containsExactlyInAnyOrder(
                testLessons.get(0).getId(),
                testLessons.get(1).getId(),
                testLessons.get(2).getId()
        );

        // Verify user B has lessons 2, 3, 4
        assertThat(userBCompletedIds).containsExactlyInAnyOrder(
                testLessons.get(2).getId(),
                testLessons.get(3).getId(),
                testLessons.get(4).getId()
        );

        // Verify they share only lesson 2
        Set<Long> intersection = new java.util.HashSet<>(userACompletedIds);
        intersection.retainAll(userBCompletedIds);
        assertThat(intersection).containsExactly(testLessons.get(2).getId());
    }

    /**
     * **Feature: platform-enhancements, Property 4: User Progress Isolation**
     * **Validates: Requirements 4.6**
     * 
     * Property: Completed lesson count is isolated per user.
     */
    @Test
    @DisplayName("Property 4: User progress isolation - completed lesson count is isolated per user")
    @Transactional
    void userProgressIsolation_completedLessonCountIsIsolatedPerUser() {
        // User A completes 2 lessons
        for (int i = 0; i < 2; i++) {
            LessonProgress progress = LessonProgress.builder()
                    .user(userA)
                    .lesson(testLessons.get(i))
                    .completed(true)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }

        // User B completes 4 lessons
        for (int i = 0; i < 4; i++) {
            LessonProgress progress = LessonProgress.builder()
                    .user(userB)
                    .lesson(testLessons.get(i))
                    .completed(true)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }

        // Verify counts are isolated
        Long userACount = progressRepository.countCompletedLessonsByUserId(userA.getId());
        Long userBCount = progressRepository.countCompletedLessonsByUserId(userB.getId());

        assertThat(userACount).isEqualTo(2);
        assertThat(userBCount).isEqualTo(4);
    }
}
