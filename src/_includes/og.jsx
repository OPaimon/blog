export default function (data) {
  const title = data.title ?? data.metas?.site ?? "派蒙的小窝";
  const description = data.description ?? "";
  const site = data.metas?.site ?? "派蒙的小窝";
  const date = data.date instanceof Date
    ? `${data.date.getFullYear()}-${
      String(data.date.getMonth() + 1).padStart(2, "0")
    }-${String(data.date.getDate()).padStart(2, "0")}`
    : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "70px 80px",
        background: "#1e1e2e",
        color: "#f6f8fa",
        fontFamily: "Noto Sans SC",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 34,
          opacity: 0.85,
        }}
      >
        ✨ {site}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        {description
          ? (
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.4,
                opacity: 0.8,
              }}
            >
              {description.length > 60
                ? description.slice(0, 60) + "…"
                : description}
            </div>
          )
          : null}
      </div>

      <div style={{ display: "flex", fontSize: 28, opacity: 0.6 }}>
        {date}
      </div>
    </div>
  );
}
