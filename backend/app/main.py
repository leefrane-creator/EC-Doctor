"""
EC Doctor FastAPI 应用入口
电商商品详情页智能诊断系统后端服务
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import router as v1_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)

app = FastAPI(
    title="EC Doctor API",
    description="电商商品详情页智能诊断系统 | E-Commerce Product Detail Page Analyzer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router)


@app.on_event("startup")
async def startup():
    logging.info("EC Doctor starting up...")


@app.get("/")
async def root():
    return {
        "service": "EC Doctor",
        "description": "E-Commerce Product Detail Page Intelligent Diagnosis System",
        "docs": "/docs",
        "version": "1.0.0",
    }
