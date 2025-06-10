import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CoursePage = lazy(() =>
  import('~/pages/CourseIndexPage').then((module) => ({
    default: module.default,
  })),
);

const CourseCategoryPage = lazy(() =>
  import('~/pages/CourseCategoryPage').then((module) => ({
    default: module.default,
  })),
);

const StudentPage = lazy(() =>
  import('~/pages/StudentIndexPage').then((module) => ({
    default: module.default,
  })),
);

const CourseAddPage = lazy(() =>
  import('~/pages/AddCoursePage').then((module) => ({
    default: module.default,
  })),
);

const CourseMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<CoursePage />} />
        <Route path="/add-course" element={<CourseAddPage />} />
        <Route path="/course-category" element={<CourseCategoryPage />} />
        <Route path="/students" element={<StudentPage />} />
      </Routes>
    </Suspense>
  );
};

export default CourseMain;
