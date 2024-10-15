from llama_index.core.extractors import (
    SummaryExtractor,
    QuestionsAnsweredExtractor,
    TitleExtractor,
    KeywordExtractor,
    BaseExtractor,
)
# from llama_index.extractors.entity import EntityExtractor
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import TokenTextSplitter
from pydantic import BaseModel, Field
from typing import List
from llama_index.program.openai import OpenAIPydanticProgram
from llama_index.core.extractors import PydanticProgramExtractor

class NodeMetadata(BaseModel):
    """Node metadata."""

    label: List[str] = Field(
        ..., description=f"""
        at least 5 keywords of the document that are related to the department, 
        where the department is the department that will most possibly use this document in daily life.
        """
    )


def pydantic_metadata_extractor(llm):
    EXTRACT_TEMPLATE_STR = """\
        Here is the content of the section:
        ----------------
        {context_str}
        ----------------
        Given the contextual information, extract out a {class_name} object.\
        """
    openai_program = OpenAIPydanticProgram.from_defaults(
        llm=llm,
        output_cls=NodeMetadata,
        prompt_template_str="{input}",
        extract_template_str=EXTRACT_TEMPLATE_STR
    )

    program_extractor = PydanticProgramExtractor(
        program=openai_program, input_key="input", show_progress=True
    )
    return program_extractor


def get_text_splitter(seperator=" ", chunk_size=512, chunk_overlap=256):
    text_splitter = TokenTextSplitter(
        separator=seperator, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return text_splitter


def split_text_with_metadata(text, llm):
    extractors = [
        TitleExtractor(nodes=5, llm=llm),
        QuestionsAnsweredExtractor(questions=3, llm=llm),
        # EntityExtractor(prediction_threshold=0.5),
        SummaryExtractor(summaries=["prev", "self", "next"], llm=llm),
        KeywordExtractor(keywords=5, llm=llm),
        pydantic_metadata_extractor(llm=llm)
    ]
    #print(text, llm)
    text_splitter = get_text_splitter()
    transformations = [text_splitter] + extractors
    print("start extracting metadata...")
    pipeline = IngestionPipeline(transformations=transformations)
    test_nodes = pipeline.run(documents=text)
    return test_nodes

def path_convertor(base_path, path):
    # convert windows path to linux path
    relative_path = os.path.relpath(base_path, path)
    final_path = os.path.join(base_path, relative_path)
    return final_path.replace('\\', '/')
