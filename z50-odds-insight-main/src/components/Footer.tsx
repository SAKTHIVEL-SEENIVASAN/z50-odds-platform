const Footer = () => (
  <footer className="border-t border-border bg-card py-6">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Built by <span className="font-semibold text-foreground">Sakthivel S M</span> · AI Engineer
        </p>
        <a
          href="mailto:s.m.sakthivelofficial@gmail.com"
          className="text-sm text-primary hover:underline"
        >
          s.m.sakthivelofficial@gmail.com
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
