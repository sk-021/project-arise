from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class AIHistory(Base):
    __tablename__ = "ai_history"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    feature_type = Column(String)  # resume | project | linkedin
    input_text = Column(Text)
    output_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
