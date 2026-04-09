from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI service running "}

@app.post("/generate-odds")
def generate(data: dict):
    a = data["teamA_rating"]
    b = data["teamB_rating"]

    total = a + b
    pa = a / total
    pb = b / total
    draw = 0.15

    pa *= (1 - draw)
    pb *= (1 - draw)

    return {
        "teamA_win_prob": pa,
        "teamB_win_prob": pb,
        "draw_prob": draw,
        "odds": {
            "teamA": round(1/pa, 2),
            "teamB": round(1/pb, 2),
            "draw": round(1/draw, 2)
        }
    }