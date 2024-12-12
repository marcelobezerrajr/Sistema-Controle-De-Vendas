from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import logging

from app.schemas.schemas_parcela import ParcelaCreate, ParcelaUpdate
from app.database.models.models_vendas import Parcela, Venda
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_parcelas(db: Session):
    return db.query(Parcela).all()

def get_parcela_by_id(db: Session, id_parcela: int):
    return check_exists_database(db, Parcela, 'id_parcela', id_parcela, "Parcela não encontrada")
    
def create_parcela(db: Session, parcela: ParcelaCreate):
    check_exists_database(db, Venda, 'id_venda', parcela.id_venda, "Venda não encontrada")
    
    try:
        data_prevista = datetime.strptime(parcela.data_prevista, '%Y/%m/%d').date()
        data_recebimento = None
        if parcela.data_recebimento:
            data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()

        db_parcela = Parcela(
            id_venda=parcela.id_venda,
            numero_parcela=parcela.numero_parcela,
            valor_parcela=parcela.valor_parcela,
            data_prevista=data_prevista,
            data_recebimento=data_recebimento,
            status=parcela.status,
            forma_recebimento=parcela.forma_recebimento
        )
        
        db.add(db_parcela)
        db.commit()
        db.refresh(db_parcela)
        return db_parcela
    except HTTPException as e:
        logger.error(f"Erro ao criar parcela (HTTP): {str(e)} - Parcela: {parcela}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar parcela {parcela}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar a parcela.")

def update_parcela(db: Session, id_parcela: int, parcela: ParcelaUpdate):
    db_parcela = get_parcela_by_id(db, id_parcela)

    if parcela.id_venda:
        check_exists_database(db, Venda, 'id_venda', parcela.id_venda, "Venda não encontrada")
        db_parcela.id_venda = parcela.id_venda
    if parcela.numero_parcela:
        db_parcela.numero_parcela = parcela.numero_parcela
    if parcela.valor_parcela:
        db_parcela.valor_parcela = parcela.valor_parcela
    if parcela.data_prevista:
        db_parcela.data_prevista = datetime.strptime(parcela.data_prevista, '%Y/%m/%d').date()
    if parcela.data_recebimento:
        db_parcela.data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()
    if parcela.status:
        db_parcela.status = parcela.status
    if parcela.forma_recebimento:
        db_parcela.forma_recebimento = parcela.forma_recebimento

    try:
        db.commit()
        db.refresh(db_parcela)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar a parcela no banco de dados"
        ) from e
    
    return db_parcela

def delete_parcela(db: Session, id_parcela: int):
    parcelas = get_parcela_by_id(db, id_parcela)
    db.delete(parcelas)
    db.commit()
    return parcelas