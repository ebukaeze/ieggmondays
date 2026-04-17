export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-foreground/10">
      <p className="text-sm text-foreground/50">
        &copy; {new Date().getFullYear()} ieggmondays
      </p>
    </footer>
  );
}
